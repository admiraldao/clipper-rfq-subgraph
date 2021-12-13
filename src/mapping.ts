import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import {
  ClipperDirectExchange,
  Deposited,
  Swapped,
  Withdrawn,
} from '../types/ClipperDirectExchange/ClipperDirectExchange'
import { Deposit, Swap, Withdrawal } from '../types/schema'
import { BIG_DECIMAL_ZERO, BIG_INT_ONE, DIRECT_EXCHANGE_ADDRESS } from './constants'
import { updatePair } from './entities/Pair'
import { loadPool, updatePoolStatus } from './entities/Pool'
import { upsertUser } from './entities/User'
import { convertTokenToDecimal, loadToken, loadTransactionSource } from './utils'
import { getUsdPrice } from './utils/prices'
import { fetchTokenBalance } from './utils/token'

export function handleDeposited(event: Deposited): void {
  let pool = loadPool()
  let poolAddress = Address.fromString(pool.id)
  let poolContract = ClipperDirectExchange.bind(poolAddress)
  let nTokens = poolContract.nTokens()
  let timestamp = event.block.timestamp
  let txHash = event.transaction.hash.toHexString()

  for (let i: i32 = 0; i < nTokens.toI32(); i++) {
    let nToken = poolContract.tokenAt(BigInt.fromI32(i))
    let token = loadToken(nToken)
    let decimalTokenBalance = fetchTokenBalance(token, poolAddress)
    let depositAmount = decimalTokenBalance.minus(token.tvl)

    // only run deposit logic if deposit amount is greater than zero, otherwise, leave the store as it was.
    if (depositAmount.gt(BIG_DECIMAL_ZERO)) {
      let tokenUsdPrice = getUsdPrice(token.symbol)
      let depositUSD = tokenUsdPrice.times(depositAmount)
      let newDeposit = new Deposit(
        timestamp
          .toString()
          .concat('-')
          .concat(txHash)
          .concat('-')
          .concat(token.id),
      )
      newDeposit.timestamp = timestamp
      newDeposit.amount = depositAmount
      newDeposit.token = token.id
      newDeposit.amountUsd = depositUSD
      newDeposit.pool = pool.id
      newDeposit.sender = event.params.depositor

      token.tvl = decimalTokenBalance
      token.tvlUSD = decimalTokenBalance.times(tokenUsdPrice)
      token.deposited = token.deposited.plus(depositAmount)
      token.depositedUSD = token.depositedUSD.plus(depositUSD)

      newDeposit.save()
      token.save()
    }
  }
}

export function handleWithdrawn(event: Withdrawn): void {
  let pool = loadPool()
  let poolAddress = Address.fromString(pool.id)
  let poolContract = ClipperDirectExchange.bind(poolAddress)
  let nTokens = poolContract.nTokens()
  let timestamp = event.block.timestamp
  let txHash = event.transaction.hash.toHexString()

  for (let i: i32 = 0; i < nTokens.toI32(); i++) {
    let nToken = poolContract.tokenAt(BigInt.fromI32(i))
    let token = loadToken(nToken)
    let decimalTokenBalance = fetchTokenBalance(token, poolAddress)
    let withdrawnAmount = token.tvl.minus(decimalTokenBalance)

    if (withdrawnAmount.gt(BIG_DECIMAL_ZERO)) {
      let tokenUsdPrice = getUsdPrice(token.symbol)
      let withdrawalUSD = tokenUsdPrice.times(withdrawnAmount)
      let newWithdrawal = new Withdrawal(
        timestamp
          .toString()
          .concat('-')
          .concat(txHash)
          .concat('-')
          .concat(token.id),
      )
      newWithdrawal.timestamp = timestamp
      newWithdrawal.amount = withdrawnAmount
      newWithdrawal.token = token.id
      newWithdrawal.amountUsd = withdrawalUSD
      newWithdrawal.pool = pool.id
      newWithdrawal.withdrawer = event.params.withdrawer

      token.tvl = decimalTokenBalance
      token.tvlUSD = decimalTokenBalance.times(tokenUsdPrice)
      token.deposited = token.deposited.minus(withdrawnAmount)
      token.depositedUSD = token.depositedUSD.minus(withdrawalUSD)

      newWithdrawal.save()
      token.save()
    }
  }
}

export function handleSwapped(event: Swapped): void {
  let inAsset = loadToken(event.params.inAsset)
  let outAsset = loadToken(event.params.outAsset)
  let poolAddress = Address.fromString(DIRECT_EXCHANGE_ADDRESS)

  let amountIn = convertTokenToDecimal(event.params.inAmount, inAsset.decimals)
  let amountOut = convertTokenToDecimal(event.params.outAmount, outAsset.decimals)

  let inputPrice = getUsdPrice(inAsset.symbol)
  let outputPrice = getUsdPrice(outAsset.symbol)
  let amountInUsd = inputPrice.times(amountIn)
  let amountOutUsd = outputPrice.times(amountOut)
  let transactionVolume = amountInUsd.plus(amountOutUsd).div(BigDecimal.fromString('2'))

  // token balances
  let inTokenBalance = fetchTokenBalance(inAsset, poolAddress)
  let outTokenBalance = fetchTokenBalance(outAsset, poolAddress)
  let inTokenBalanceUsd = inputPrice.times(inTokenBalance)
  let outTokenBalanceUsd = outputPrice.times(outTokenBalance)

  let swap = new Swap(event.transaction.hash.toHex())
  swap.transaction = event.transaction.hash
  swap.timestamp = event.block.timestamp
  swap.inToken = inAsset.id
  swap.outToken = outAsset.id
  swap.origin = event.transaction.from
  swap.recipient = event.params.recipient
  swap.amountIn = amountIn
  swap.amountOut = amountOut
  swap.logIndex = event.logIndex
  swap.pricePerInputToken = inputPrice
  swap.pricePerOutputToken = outputPrice
  swap.amountInUSD = amountInUsd
  swap.amountOutUSD = amountOutUsd
  swap.pool = DIRECT_EXCHANGE_ADDRESS

  // update assets values

  // if both assets are the same, update just one with the subtraction of both amounts
  if (inAsset.id === outAsset.id) {
    inAsset.txCount = inAsset.txCount.plus(BIG_INT_ONE)
    inAsset.volume = inAsset.volume.plus(amountIn.plus(amountOut).div(BigDecimal.fromString('2')))
    inAsset.volumeUSD = inAsset.volumeUSD.plus(transactionVolume)
    inAsset.tvl = inTokenBalance
    inAsset.tvlUSD = inTokenBalanceUsd
    inAsset.save()
  } else {
    outAsset.txCount = outAsset.txCount.plus(BIG_INT_ONE)
    outAsset.volume = outAsset.volume.plus(amountOut)
    outAsset.volumeUSD = outAsset.volumeUSD.plus(amountOutUsd)
    outAsset.tvl = outTokenBalance
    outAsset.tvlUSD = outTokenBalanceUsd
    outAsset.save()

    inAsset.txCount = inAsset.txCount.plus(BIG_INT_ONE)
    inAsset.volume = inAsset.volume.plus(amountIn)
    inAsset.volumeUSD = inAsset.volumeUSD.plus(amountInUsd)
    inAsset.tvl = inTokenBalance
    inAsset.tvlUSD = inTokenBalanceUsd
    inAsset.save()
  }

  let txSource = loadTransactionSource(event)
  swap.transactionSource = txSource.id
  txSource.txCount = txSource.txCount.plus(BIG_INT_ONE)

  let workingPair = updatePair(
    event.params.inAsset.toHexString(),
    event.params.outAsset.toHexString(),
    transactionVolume,
  )
  let isUnique = upsertUser(event.transaction.from.toHexString(), event.block.timestamp, transactionVolume)
  swap.pair = workingPair.id
  swap.sender = event.transaction.from.toHexString()
  updatePoolStatus(event.block.timestamp, transactionVolume, isUnique)

  swap.save()
  txSource.save()
}

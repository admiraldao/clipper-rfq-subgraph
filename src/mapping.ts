import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import {
  ClipperDirectExchange,
  // Approval,
  Deposited,
  Swapped,
  Transfer,
  Withdrawn,
} from '../types/ClipperDirectExchange/ClipperDirectExchange'
import { ERC20 } from '../types/ClipperDirectExchange/ERC20'
import { Deposit, Swap } from '../types/schema'
import { BIG_INT_ONE, DIRECT_EXCHANGE_ADDRESS } from './constants'
import { updatePair } from './entities/Pair'
import { loadPool, updatePoolStatus } from './entities/Pool'
import { upsertUser } from './entities/User'
import { convertTokenToDecimal, loadToken, loadTransactionSource } from './utils'
import { getUsdPrice } from './utils/prices'

export function handleDeposited(event: Deposited): void {
  let pool = loadPool()
  let poolAddress = Address.fromString(pool.id)
  let poolContract = ClipperDirectExchange.bind(poolAddress)
  let nTokens = poolContract.nTokens()
  let timestamp = event.block.timestamp
  let txHash = event.transaction.hash.toHexString()

  for (let i: i32 = 0; i < nTokens.toI32(); i++) {
    let nToken = poolContract.tokenAt(BigInt.fromI32(i))
    let tokenContract = ERC20.bind(nToken)
    let token = loadToken(nToken)
    let tokenBalance = tokenContract.balanceOf(poolAddress)
    let decimalTokenBalance = convertTokenToDecimal(tokenBalance, token.decimals)
    let depositAmount = decimalTokenBalance.minus(token.tvl)
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

    token.tvl = token.tvl.plus(depositAmount)
    token.tvlUSD = token.tvlUSD.plus(depositUSD)
    token.deposited = token.deposited.plus(depositAmount)
    token.depositedUSD = token.depositedUSD.plus(depositUSD)

    newDeposit.save()
    token.save()
  }
}

export function handleSwapped(event: Swapped): void {
  let inAsset = loadToken(event.params.inAsset)
  let outAsset = loadToken(event.params.outAsset)

  let amountIn = convertTokenToDecimal(event.params.inAmount, inAsset.decimals)
  let amountOut = convertTokenToDecimal(event.params.outAmount, outAsset.decimals)

  let inputPrice = getUsdPrice(inAsset.symbol)
  let outputPrice = getUsdPrice(outAsset.symbol)
  let amountInUsd = inputPrice.times(amountIn)
  let amountOutUsd = outputPrice.times(amountOut)
  let transactionVolume = amountInUsd.plus(amountOutUsd).div(BigDecimal.fromString('2'))

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
  outAsset.txCount = outAsset.txCount.plus(BIG_INT_ONE)
  outAsset.volume = outAsset.volume.plus(amountOut)
  outAsset.volumeUSD = outAsset.volumeUSD.plus(amountOutUsd)
  outAsset.tvl = outAsset.tvl.minus(amountOut)
  outAsset.tvlUSD = outAsset.tvlUSD.minus(amountOutUsd)

  inAsset.txCount = inAsset.txCount.plus(BIG_INT_ONE)
  inAsset.volume = inAsset.volume.plus(amountIn)
  inAsset.volumeUSD = inAsset.volumeUSD.plus(amountInUsd)
  inAsset.tvl = inAsset.tvl.plus(amountIn)
  inAsset.tvlUSD = inAsset.tvlUSD.plus(amountInUsd)

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

  inAsset.save()
  outAsset.save()
  swap.save()
  txSource.save()
}

export function handleTransfer(event: Transfer): void {}

export function handleWithdrawn(event: Withdrawn): void {}

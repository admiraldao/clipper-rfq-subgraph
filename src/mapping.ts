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
import { convertTokenToDecimal, getCurrentPoolLiquidity, loadToken, loadTransactionSource } from './utils'
import { getUsdPrice } from './utils/prices'
import { fetchTokenBalance } from './utils/token'

export function handleDeposited(event: Deposited): void {
  let timestamp = event.block.timestamp
  let txHash = event.transaction.hash.toHexString()
  let currentPoolLiquidity = getCurrentPoolLiquidity()
  let poolAddress = Address.fromString(DIRECT_EXCHANGE_ADDRESS)
  let poolContract = ClipperDirectExchange.bind(poolAddress)
  let poolTokenSupply = poolContract.totalSupply()
  let receivedPoolTokens = convertTokenToDecimal(event.params.poolTokens, BigInt.fromI32(18))
  let totalPoolTokens = convertTokenToDecimal(poolTokenSupply, BigInt.fromI32(18))

  let poolOwnedAmount = receivedPoolTokens.div(totalPoolTokens)
  let usdProportion = currentPoolLiquidity.times(poolOwnedAmount)

  let newDeposit = new Deposit(txHash)
  newDeposit.timestamp = timestamp
  newDeposit.pool = DIRECT_EXCHANGE_ADDRESS
  newDeposit.poolTokens = receivedPoolTokens
  newDeposit.amountUsd = usdProportion
  newDeposit.depositor = event.params.depositor

  newDeposit.save()
}

export function handleWithdrawn(event: Withdrawn): void {
  let timestamp = event.block.timestamp
  let txHash = event.transaction.hash.toHexString()
  let currentPoolLiquidity = getCurrentPoolLiquidity()
  let poolAddress = Address.fromString(DIRECT_EXCHANGE_ADDRESS)
  let poolContract = ClipperDirectExchange.bind(poolAddress)
  let poolTokenSupply = poolContract.totalSupply()

  let totalPoolTokens = convertTokenToDecimal(poolTokenSupply, BigInt.fromI32(18))
  let burntPoolTokens = convertTokenToDecimal(event.params.poolTokens, BigInt.fromI32(18))

  let burntProportion = burntPoolTokens.div(totalPoolTokens.plus(burntPoolTokens))
  let usdProportion = currentPoolLiquidity.times(burntProportion)

  let newWithdrawal = new Withdrawal(txHash)
  newWithdrawal.timestamp = timestamp
  newWithdrawal.amountUsd = usdProportion
  newWithdrawal.poolTokens = burntPoolTokens
  newWithdrawal.pool = DIRECT_EXCHANGE_ADDRESS
  newWithdrawal.withdrawer = event.params.withdrawer

  newWithdrawal.save()
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

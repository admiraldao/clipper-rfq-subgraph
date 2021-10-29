import { BigDecimal } from '@graphprotocol/graph-ts'
import {
  ClipperDirectExchange,
  // Approval,
  Deposited,
  Swapped,
  Transfer,
  Withdrawn,
} from '../types/ClipperDirectExchange/ClipperDirectExchange'
import { Swap } from '../types/schema'
import { BIG_INT_ONE, DIRECT_EXCHANGE_ADDRESS } from './constants'
import { updatePair } from './entities/Pair'
import { updatePoolStatus } from './entities/Pool'
import { upsertUser } from './entities/User'
import { convertTokenToDecimal, loadToken, loadTransactionSource } from './utils'
import { getUsdPrice } from './utils/prices'

export function handleDeposited(event: Deposited): void {}

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

  let txSource = loadTransactionSource(event)
  swap.transactionSource = txSource.id
  txSource.txCount = txSource.txCount.plus(BIG_INT_ONE)

  let workingPair = updatePair(
    event.params.inAsset.toHexString(),
    event.params.outAsset.toHexString(),
    transactionVolume,
  )
  let isUnique = upsertUser(event.transaction.from, event.block.timestamp, transactionVolume)
  swap.pair = workingPair.id
  swap.sender = event.transaction.from.toString()
  updatePoolStatus(event.block.timestamp, transactionVolume, isUnique)

  swap.save()
  txSource.save()
}

export function handleTransfer(event: Transfer): void {}

export function handleWithdrawn(event: Withdrawn): void {}

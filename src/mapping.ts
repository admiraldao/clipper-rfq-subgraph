import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { BIG_DECIMAL_ZERO } from '../../ethereum-subgraph/src/utils/constants'
import { getUsdPrice } from '../../ethereum-subgraph/src/utils/prices'
import {
  ClipperDirectExchange,
  // Approval,
  Deposited,
  Swapped,
  Transfer,
  Withdrawn,
} from '../types/ClipperDirectExchange/ClipperDirectExchange'
import { Swap, Token } from '../types/schema'
import { BIG_INT_ONE } from './constants'
import { convertTokenToDecimal, loadPair, loadTransaction, loadTransactionSource } from './utils'

export function handleDeposited(event: Deposited): void {}

export function handleSwapped(event: Swapped): void {
  // let tokenPair = loadPair(event)

  let inAsset = Token.load(event.params.inAsset.toHex())
  let outAsset = Token.load(event.params.outAsset.toHex())

  let amountIn = convertTokenToDecimal(event.params.inAmount, inAsset.decimals)
  let amountOut = convertTokenToDecimal(event.params.outAmount, outAsset.decimals)

  let inputPrice = getUsdPrice(inAsset.symbol)
  let outputPrice = getUsdPrice(outAsset.symbol)
  let amountInUsd = inputPrice.times(amountIn)
  let amountOutUsd = outputPrice.times(amountOut)
  let transactionVolume = amountInUsd.plus(amountOutUsd).div(BigDecimal.fromString('2'))

  let transaction = loadTransaction(event)
  let swap = new Swap(event.transaction.hash.toHex())
  swap.transaction = transaction.id
  swap.timestamp = transaction.timestamp
  swap.inToken = inAsset.id
  swap.outToken = outAsset.id
  swap.sender = event.transaction.from
  swap.origin = event.transaction.from
  swap.recipient = event.params.recipient
  swap.amountIn = amountIn
  swap.amountOut = amountOut
  swap.logIndex = event.logIndex
  swap.pricePerInputToken = inputPrice
  swap.pricePerOutputToken = outputPrice
  swap.amountInUSD = amountInUsd
  swap.amountOutUSD = amountOutUsd

  let txSource = loadTransactionSource(event)
  swap.transactionSource = txSource.id
  txSource.txCount = txSource.txCount.plus(BIG_INT_ONE)

  swap.save()
}

export function handleTransfer(event: Transfer): void {}

export function handleWithdrawn(event: Withdrawn): void {}

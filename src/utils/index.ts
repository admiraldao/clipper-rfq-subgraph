import { Address, BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { Swapped } from '../../types/ClipperDirectExchange/ClipperDirectExchange'
import { Pair, Token, Transaction, TransactionSource } from '../../types/schema'
import { BIG_DECIMAL_ZERO, BIG_INT_ONE, BIG_INT_ZERO } from '../constants'
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from './token'

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = BIG_INT_ZERO; i.lt(decimals as BigInt); i = i.plus(BIG_INT_ONE)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == BIG_INT_ZERO) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function loadPair(event: Swapped): Pair {
  let pairId = event.params.inAsset.toHexString().concat(event.params.outAsset.toHexString())
  let altPairId = event.params.outAsset.toHexString().concat(event.params.inAsset.toHexString())

  let pair = Pair.load(pairId)

  // load alternative pair id in case first is not found
  if (!pair) {
    pair = Pair.load(altPairId)
  }

  if (!pair) {
    pair = new Pair(pairId)
    pair.asset0 = event.params.inAsset.toHexString()
    pair.asset1 = event.params.outAsset.toHexString()
    pair.txCount = BIG_INT_ZERO
    pair.volumeUSD = BIG_DECIMAL_ZERO
    pair.swaps = []
    pair.save()
  }

  return pair as Pair
}

export function loadTransaction(event: ethereum.Event): Transaction {
  let transaction = Transaction.load(event.transaction.hash.toHexString())
  if (!transaction) {
    transaction = new Transaction(event.transaction.hash.toHexString())
  }
  transaction.blockNumber = event.block.number
  transaction.timestamp = event.block.timestamp
  transaction.gasUsed = event.transaction.gasUsed
  transaction.gasPrice = event.transaction.gasPrice
  transaction.save()

  // compilation requires splicit cast
  return transaction as Transaction
}

export function loadTransactionSource(event: Swapped): TransactionSource {
  let txSourceId = event.params.auxiliaryData.toString() || 'UNKNOWN'

  let txSource = TransactionSource.load(txSourceId)
  if (!txSource) {
    txSource = new TransactionSource(txSourceId)
    txSource.txCount = BIG_INT_ZERO

    txSource.save()
  }

  return txSource as TransactionSource
}

export function loadToken(tokenAddress: Address): Token {
  let token = Token.load(tokenAddress.toHex())

  if (!token) {
    token = new Token(tokenAddress.toHex())
    let symbol = fetchTokenSymbol(tokenAddress)
    token.symbol = symbol
    token.name = fetchTokenName(tokenAddress)
    token.decimals = fetchTokenDecimals(tokenAddress)
    token.txCount = BIG_INT_ZERO
    token.volume = BIG_DECIMAL_ZERO
    token.volumeUSD = BIG_DECIMAL_ZERO
    token.tvl = BIG_DECIMAL_ZERO
    token.tvlUSD = BIG_DECIMAL_ZERO
  }

  return token as Token
}

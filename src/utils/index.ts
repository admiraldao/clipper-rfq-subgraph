import { Address, BigDecimal, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {  Token, TransactionSource } from '../../types/schema'
import { ShorttailAssets } from '../addresses'
import { BIG_DECIMAL_ZERO, BIG_INT_ONE, BIG_INT_ZERO, LongTailType, ShortTailType } from '../constants'
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

export function loadTransactionSource(auxData: Bytes): TransactionSource {
  let txSourceId = auxData.toString() || 'Unknown'

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
    let isShorttail = ShorttailAssets.isSet(tokenAddress)
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
    token.deposited = BIG_DECIMAL_ZERO
    token.depositedUSD = BIG_DECIMAL_ZERO
    if (isShorttail) {
      token.type = ShortTailType
    } else {
      token.type = LongTailType
      token.cove = tokenAddress.toHexString()
    }

    token.save()
  }

  return token as Token
}
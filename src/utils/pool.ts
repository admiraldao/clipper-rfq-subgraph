import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { loadToken } from '.'
import { ClipperDirectExchange } from '../../types/ClipperDirectExchange/ClipperDirectExchange'
import { getUsdPrice } from './prices'
import { fetchTokenBalance } from './token'

export function getCurrentPoolLiquidity(poolId: string): BigDecimal {
  let poolAddress = Address.fromString(poolId)
  let poolContract = ClipperDirectExchange.bind(poolAddress)
  let nTokens = poolContract.nTokens()
  let currentLiquidity = BigDecimal.fromString('0')

  for (let i: i32 = 0; i < nTokens.toI32(); i++) {
    let nToken = poolContract.tokenAt(BigInt.fromI32(i))
    let token = loadToken(nToken)
    let tokenBalance = fetchTokenBalance(token, poolAddress)
    let tokenUsdPrice = getUsdPrice(token.symbol)
    let usdTokenLiquidity = tokenBalance.times(tokenUsdPrice)

    currentLiquidity = currentLiquidity.plus(usdTokenLiquidity)

    token.tvl = tokenBalance
    token.tvlUSD = tokenUsdPrice
    token.save()
  }

  return currentLiquidity
}

export function getPoolTokenSupply(poolId: string): BigInt {
  let poolAddress = Address.fromString(poolId)
  let poolContract = ClipperDirectExchange.bind(poolAddress)
  let poolTokenSupply = poolContract.totalSupply()

  return poolTokenSupply
}

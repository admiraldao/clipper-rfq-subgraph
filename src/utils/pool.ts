import { Address, BigDecimal, BigInt, log } from '@graphprotocol/graph-ts'
import { loadToken } from '.'
import { ClipperDirectExchange } from '../../types/ClipperDirectExchange/ClipperDirectExchange'
import { getUsdPrice } from './prices'
import { fetchTokenBalance } from './token'

export function getCurrentPoolLiquidity(poolId: string): BigDecimal {
  let poolAddress = Address.fromString(poolId)
  let poolContract = ClipperDirectExchange.bind(poolAddress)
  let nTokens = poolContract.nTokens()
  let currentLiquidity = BigDecimal.fromString('0')

  if (Address.fromHexString(poolId).equals(Address.fromHexString('0xCE37051a3e60587157DC4c0391B4C555c6E68255'))) {
    let hardcodedLiquidity = BigDecimal.fromString('550000')
    log.info('Setting hardcoded liquidity to {}', [hardcodedLiquidity.toString()])
    return hardcodedLiquidity
  }

  log.info('fetching liquidity from tokens', [])
  for (let i: i32 = 0; i < nTokens.toI32(); i++) {
    let nToken = poolContract.try_tokenAt(BigInt.fromI32(i))
    if (!nToken.reverted) {
      let token = loadToken(nToken.value)
      let tokenBalance = fetchTokenBalance(token, poolAddress)
      let tokenUsdPrice = getUsdPrice(token.symbol)
      let usdTokenLiquidity = tokenBalance.times(tokenUsdPrice)
  
      currentLiquidity = currentLiquidity.plus(usdTokenLiquidity)
  
      token.tvl = tokenBalance
      token.tvlUSD = tokenUsdPrice
      token.save()
    } else {
      log.info('Not able to fetch nToken {}', [i.toString()])
    }
  }

  return currentLiquidity
}

export function getPoolTokenSupply(poolId: string): BigInt {
  let poolAddress = Address.fromString(poolId)
  let poolContract = ClipperDirectExchange.bind(poolAddress)
  let poolTokenSupply = poolContract.totalSupply()

  return poolTokenSupply
}

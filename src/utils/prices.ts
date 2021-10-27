import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { convertTokenToDecimal } from '.'
import { DIRECT_EXCHANGE_ADDRESS, PriceOracleAddresses } from '../constants'
import { AggregatorV3Interface } from '../../types/ClipperDirectExchange/AggregatorV3Interface'
import { ClipperDirectExchange } from '../../types/ClipperDirectExchange/ClipperDirectExchange'

export function getUsdPrice(tokenSymbol: string): BigDecimal {
  let oracleAddress = Address.fromString(PriceOracleAddresses.get(tokenSymbol).toString())
  let oracleContract = AggregatorV3Interface.bind(oracleAddress)
  let answer = oracleContract.latestRoundData()
  let decimals = oracleContract.decimals()
  let price = answer.value1

  let usdValue = convertTokenToDecimal(price, BigInt.fromI32(decimals))

  return usdValue
}

// export function getSwapFee(outputAmount: BigDecimal): BigDecimal {
//   let exchangeAddress = Address.fromString(DIRECT_EXCHANGE_ADDRESS)
//   let contract = ClipperDirectExchange.bind(exchangeAddress)
//   let feeUnit = contract.swapFee().toBigDecimal()

//   let swapFee = feeUnit.div(BigDecimal.fromString('10000').minus(feeUnit))

//   return outputAmount.times(swapFee)
// }

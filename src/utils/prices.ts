import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { convertTokenToDecimal } from '.'
import { AggregatorV3Interface } from '../../types/ClipperDirectExchange/AggregatorV3Interface'
import { PriceOracleAddresses } from '../addresses'

export function getUsdPrice(tokenSymbol: string): BigDecimal {
  let oracleAddress = Address.fromString(PriceOracleAddresses.get(tokenSymbol).toString())
  let oracleContract = AggregatorV3Interface.bind(oracleAddress)
  let answer = oracleContract.latestRoundData()
  let decimals = oracleContract.decimals()
  let price = answer.value1

  let usdValue = convertTokenToDecimal(price, BigInt.fromI32(decimals))

  return usdValue
}

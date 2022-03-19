import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { convertTokenToDecimal } from '.'
import { AggregatorV3Interface } from '../../types/ClipperDirectExchange/AggregatorV3Interface'
import { FallbackAssetPrice, PriceOracleAddresses } from '../addresses'
import { ADDRESS_ZERO } from '../constants'

export function getUsdPrice(tokenSymbol: string): BigDecimal {
  let oracleAddressString = PriceOracleAddresses.get(tokenSymbol).toString()
  let oracleValueExist = PriceOracleAddresses.isSet(tokenSymbol)
  let fallbackExist = FallbackAssetPrice.isSet(tokenSymbol)

  if ((!oracleValueExist || oracleAddressString === ADDRESS_ZERO) && fallbackExist) {
    let fallbackPrice = FallbackAssetPrice.get(tokenSymbol).toString()
    return BigDecimal.fromString(fallbackPrice)
  }

  if ((!oracleValueExist || oracleAddressString === ADDRESS_ZERO) && !fallbackExist) return BigDecimal.fromString('1')

  let oracleAddress = Address.fromString(oracleAddressString)
  let oracleContract = AggregatorV3Interface.bind(oracleAddress)
  let answer = oracleContract.latestRoundData()
  let decimals = oracleContract.decimals()
  let price = answer.value1

  let usdValue = convertTokenToDecimal(price, BigInt.fromI32(decimals))

  return usdValue
}

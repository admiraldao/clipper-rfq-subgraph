import { BigInt, BigDecimal, TypedMap } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const DIRECT_EXCHANGE_ADDRESS = '0x69107C1Fc1Dbf486EA64ad4Fe6f9be81b8265f92'

export let BIG_DECIMAL_ZERO = BigDecimal.fromString('0')
export let BIG_DECIMAL_ONE = BigDecimal.fromString('1')
export let BIG_INT_ZERO = BigInt.fromI32(0)
export let BIG_INT_ONE = BigInt.fromI32(1)
export let BIG_INT_EIGHTEEN = BigInt.fromI32(18)
export let ONE_HOUR = BigInt.fromI32(3600)
export let ONE_DAY = BigInt.fromI32(86400)

export let PriceOracleAddresses = new TypedMap<string, string>()
PriceOracleAddresses.set('WETH', '0xF9680D99D6C9589e2a93a78A04A279e509205945') // eth / usd chainlink oracle
PriceOracleAddresses.set('WBTC', '0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6') // wbtc / usd cahainlink oracle
PriceOracleAddresses.set('DAI', '0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D') // dai / usd chainlink oracle
PriceOracleAddresses.set('USDC', '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7') // usdc / usd chainlink oracle
PriceOracleAddresses.set('USDT', '0x0A6513e40db6EB1b165753AD52E80663aeA50545') // usdt / usd chainlink oracle
PriceOracleAddresses.set('GYEN', '0xD647a6fC9BC6402301583C91decC5989d8Bc382D') // JPY / USD chainlink oracle
PriceOracleAddresses.set('MATIC', '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0') // MATIC / USD chainlink oracle
PriceOracleAddresses.set('WMATIC', '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0') // MATIC / USD chainlink oracle

import { Address, TypedMap } from '@graphprotocol/graph-ts'

export let clipperDirectExchangeAddress = Address.fromString('{{clipperDirectExchange}}')

export let PriceOracleAddresses = new TypedMap<string, string>()
PriceOracleAddresses.set('WETH', '{{ethOracleAddress}}') // eth / usd chainlink oracle
PriceOracleAddresses.set('EARTH', '{{ethOracleAddress}}') // eth / usd chainlink oracle
PriceOracleAddresses.set('ERTH', '{{ethOracleAddress}}') // eth / usd chainlink oracle
PriceOracleAddresses.set('WBTC', '{{btcOracleAddress}}') // wbtc / usd cahainlink oracle
PriceOracleAddresses.set('DAI', '{{daiOracleAddress}}') // dai / usd chainlink oracle
PriceOracleAddresses.set('USDC', '{{usdcOracleAddress}}') // usdc / usd chainlink oracle
PriceOracleAddresses.set('USDT', '{{usdtOracleAddress}}') // usdt / usd chainlink oracle
PriceOracleAddresses.set('GYEN', '{{jpyOracleAddress}}') // JPY / USD chainlink oracle
PriceOracleAddresses.set('MATIC', '{{maticOracleAddress}}') // MATIC / USD chainlink oracle
PriceOracleAddresses.set('WMATIC', '{{maticOracleAddress}}') // MATIC / USD chainlink oracle
PriceOracleAddresses.set('DOT', '{{dotOracleAddress}}') // DOT / USD chainlink oracle
PriceOracleAddresses.set('LINK', '{{linkOracleAddress}}') // LINk / USD chainlink oracle

export let FallbackAssetPrice = new TypedMap<string, string>()
FallbackAssetPrice.set('GLMR', '{{fallbackPrices.GLMR}}')
FallbackAssetPrice.set('MOVR', '{{fallbackPrices.MOVR}}')
FallbackAssetPrice.set('WETH', '{{fallbackPrices.WETH}}')
FallbackAssetPrice.set('USDT', '{{fallbackPrices.USDT}}')
FallbackAssetPrice.set('DAI', '{{fallbackPrices.DAI}}')
FallbackAssetPrice.set('USDC', '{{fallbackPrices.USDC}}')
FallbackAssetPrice.set('WBTC', '{{fallbackPrices.WBTC}}')
FallbackAssetPrice.set('GYEN', '{{fallbackPrices.GYEN}}')
FallbackAssetPrice.set('MATIC', '{{fallbackPrices.MATIC}}')
FallbackAssetPrice.set('WMATIC', '{{fallbackPrices.MATIC}}')
FallbackAssetPrice.set('DOT', '{{fallbackPrices.DOT}}')
FallbackAssetPrice.set('LINK', '{{fallbackPrices.LINK}}')

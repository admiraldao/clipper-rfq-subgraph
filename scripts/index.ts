import fs from 'fs'
import handlebars from 'handlebars'
import path from 'path'
import yargs from 'yargs'

interface Deployment {
  networkName: string
  startBlock: number
  // Core
  clipperDirectExchange: string

  // Currencies
  ethOracleAddress: string
  btcOracleAddress: string
  daiOracleAddress: string
  usdcOracleAddress: string
  usdtOracleAddress: string
  jpyOracleAddress: string
  maticOracleAddress: string
  dotOracleAddress: string
  linkOracleAddress: string

  fallbackPrices?: {
    WETH: number
    MOVR: number
    DAI: number
    USDC: number
    USDT: number
    WBTC: number
    GLMR: number
    MATIC: number
    DOT: number
    LINK: number
    GYEN: number
  }
}

async function fetchDeployment(source: string): Promise<Deployment> {
  const commonConfig = {
    // as of 19/03/2022 at 00:20 AM ET.
    fallbackPrices: {
      WETH: 2948.37,
      MOVR: 53.88,
      DAI: 1,
      USDC: 1,
      USDT: 1,
      WBTC: 41741.74,
      GLMR: 2.74,
      MATIC: 1.52,
      DOT: 19.03,
      LINK: 14.91,
      GYEN: 0.008391,
    },
  }
  if (source === 'matic') {
    return {
      networkName: 'matic',
      startBlock: 21032348,

      // Core
      clipperDirectExchange: '0xD01e3549160c62Acabc4D0EB89F67aAFA3de8EEd',

      // Currencies
      ethOracleAddress: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
      btcOracleAddress: '0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6',
      daiOracleAddress: '0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D',
      usdcOracleAddress: '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7',
      usdtOracleAddress: '0x0A6513e40db6EB1b165753AD52E80663aeA50545',
      jpyOracleAddress: '0xD647a6fC9BC6402301583C91decC5989d8Bc382D',
      maticOracleAddress: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0',
      dotOracleAddress: '0x0000000000000000000000000000000000000000',
      linkOracleAddress: '0x0000000000000000000000000000000000000000',
      ...commonConfig,
    }
  }

  if (source === 'moonbase') {
    return {
      networkName: 'mbase',
      startBlock: 1518878,

      // Core
      clipperDirectExchange: '0xc2dc657a3eef28f48bad9c3db27e33c4a76efd4c',

      // Currencies
      ethOracleAddress: '0x3669da30c33D27A6A579548fCfc345fE5dEdda6e',
      btcOracleAddress: '0xCf88A8d7fc1A687895fC8ffAad567f303926B094',
      daiOracleAddress: '0x0000000000000000000000000000000000000000',
      usdcOracleAddress: '0x0000000000000000000000000000000000000000',
      usdtOracleAddress: '0x0000000000000000000000000000000000000000',
      jpyOracleAddress: '0x0000000000000000000000000000000000000000',
      maticOracleAddress: '0x0000000000000000000000000000000000000000',
      dotOracleAddress: '0xA873F6b30aD79fCAF9b03A0A883d6D1f18D661d7',
      linkOracleAddress: '0x0000000000000000000000000000000000000000',
      ...commonConfig,
    }
  }

  if (source === 'optimism') {
    return {
      networkName: 'optimism',
      startBlock: 3183055,

      // Core
      clipperDirectExchange: '0xDBD4ffC32b34f630DD8aC18D37162eC8462db7dB',

      // Currencies
      ethOracleAddress: '0x13e3Ee699D1909E989722E753853AE30b17e08c5',
      btcOracleAddress: '0xD702DD976Fb76Fffc2D3963D037dfDae5b04E593',
      daiOracleAddress: '0x8dBa75e83DA73cc766A7e5a0ee71F656BAb470d6',
      usdcOracleAddress: '0x16a9FA2FDa030272Ce99B29CF780dFA30361E0f3',
      usdtOracleAddress: '0xECef79E109e997bCA29c1c0897ec9d7b03647F5E',
      jpyOracleAddress: '0x0000000000000000000000000000000000000000',
      maticOracleAddress: '0x0000000000000000000000000000000000000000',
      dotOracleAddress: '0x0000000000000000000000000000000000000000',
      linkOracleAddress: '0xCc232dcFAAE6354cE191Bd574108c1aD03f86450',
      ...commonConfig,
    }
  }

  if (source === 'moonbeam') {
    return {
      networkName: 'moonbeam',
      startBlock: 576698,

      // Core
      clipperDirectExchange: '0xe90d415Af331237Ae18a882EC21870f1965BE933',

      // Currencies
      ethOracleAddress: '0x0000000000000000000000000000000000000000',
      btcOracleAddress: '0x0000000000000000000000000000000000000000',
      daiOracleAddress: '0x0000000000000000000000000000000000000000',
      usdcOracleAddress: '0x0000000000000000000000000000000000000000',
      usdtOracleAddress: '0x0000000000000000000000000000000000000000',
      jpyOracleAddress: '0x0000000000000000000000000000000000000000',
      maticOracleAddress: '0x0000000000000000000000000000000000000000',
      dotOracleAddress: '0x0000000000000000000000000000000000000000',
      linkOracleAddress: '0x0000000000000000000000000000000000000000',
      ...commonConfig,
    }
  }

  throw new Error('Unsupported deployment')
}

yargs
  .command(
    'template',
    'Generate files from templates using the deployment addresses.',
    yargs => {
      return yargs.option('deployment', {
        type: 'string',
        default: 'matic',
      })
    },
    async args => {
      const deploymentJson = await fetchDeployment(args.deployment)

      {
        console.log('Generating subgraph manifest')

        const templateFile = path.join(__dirname, '../templates/subgraph.yml')
        const outputFile = path.join(__dirname, '../subgraph.yaml')
        const templateContent = fs.readFileSync(templateFile, 'utf8')

        const compile = handlebars.compile(templateContent)
        const replaced = compile(deploymentJson)

        fs.writeFileSync(outputFile, replaced)
      }

      {
        console.log('Generating static address map')

        const templateFile = path.join(__dirname, '../templates/addresses.ts')
        const outputFile = path.join(__dirname, '../src/addresses.ts')
        const templateContent = fs.readFileSync(templateFile, 'utf8')

        const compile = handlebars.compile(templateContent)
        const replaced = compile(deploymentJson)

        fs.writeFileSync(outputFile, replaced)
      }
    },
  )
  .help().argv

import fs from 'fs'
import glob from 'glob'
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
}

async function fetchDeployment(source: string): Promise<Deployment> {
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

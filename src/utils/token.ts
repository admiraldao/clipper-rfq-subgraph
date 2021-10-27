import { Address, BigInt } from '@graphprotocol/graph-ts'
import { ERC20 } from '../../types/ClipperDirectExchange/ERC20'
import { ADDRESS_ZERO } from '../constants'

export function fetchTokenSymbol(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress)

  if (tokenAddress.equals(Address.fromString(ADDRESS_ZERO))) {
    return 'ETH'
  }
  // try types string and bytes32 for symbol
  let symbolValue = 'unknown'
  let symbolResult = contract.try_symbol()

  if (!symbolResult.reverted) {
    symbolValue = symbolResult.value
  }

  return symbolValue
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress)
  // try types uint8 for decimals
  let decimalValue = 18

  let decimalResult = contract.try_decimals()

  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value
  }

  return BigInt.fromI32(decimalValue as i32)
}

export function fetchTokenName(tokenAddress: Address): string {
  if (tokenAddress.equals(Address.fromString(ADDRESS_ZERO))) {
    return 'Matic'
  }

  let contract = ERC20.bind(tokenAddress)

  // try types string and bytes32 for name
  let nameValue = 'unknown'
  let nameResult = contract.try_name()

  if (!nameResult.reverted) {
    nameValue = nameResult.value
  }

  return nameValue
}

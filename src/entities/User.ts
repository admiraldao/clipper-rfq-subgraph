import { BigDecimal, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { User } from '../../types/schema'
import { BIG_DECIMAL_ZERO, BIG_INT_ONE, BIG_INT_ZERO } from '../constants'

export function updateUser(userWallet: Bytes, txTimestamp: BigInt, txVolume: BigDecimal): User {
  let user = User.load(userWallet.toHexString()) as User

  if (!user) {
    user = new User(userWallet.toHexString())
    user.firstTxTimestamp = txTimestamp
    user.volumeUSD = BIG_DECIMAL_ZERO
    user.txCount = BIG_INT_ZERO
  }

  user.lastTxTimestamp = txTimestamp
  user.volumeUSD = user.volumeUSD.plus(txVolume)
  user.txCount = user.txCount.plus(BIG_INT_ONE)
  user.save()

  return user
}

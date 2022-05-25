import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import { Cove, UserCoveStake } from "../../types/schema"
import { BIG_DECIMAL_ZERO, BIG_INT_ZERO } from "../constants"
import { loadToken } from "../utils"

export function loadCove(tokenAddress: Address, opener: Bytes, timestamp: BigInt, transaction: Bytes): Cove {
  let id = tokenAddress.toHexString()
  let cove = Cove.load(id)

  if (!cove) {
    let coveAsset = loadToken(tokenAddress)
    
    cove = new Cove(id)

    cove.longtailAsset = coveAsset.id
    cove.openedAt = timestamp
    cove.opener = opener
    cove.transaction = transaction

    // balance state
    cove.poolTokenAmount = BIG_DECIMAL_ZERO
    cove.longtailTokenAmount = BIG_DECIMAL_ZERO

    // swaps
    cove.volumeUSD = BIG_DECIMAL_ZERO
    cove.swapCount = BIG_INT_ZERO

    //deposits
    cove.depositCount = BIG_INT_ZERO

    // withdrawals
    cove.withdrawalCount = BIG_INT_ZERO

    cove.save()
  }

  return cove as Cove
}

export function loadUserCoveStake(coveId: string, userWallet: Address): UserCoveStake {
  let id = coveId.concat('-').concat(userWallet.toString())
  let stake = UserCoveStake.load(id)

  if (!stake) {
    stake = new UserCoveStake(id)
    stake.user = userWallet
    stake.cove = coveId
    stake.active = true

    stake.save()
  }

  return stake as UserCoveStake
}

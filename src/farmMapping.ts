import { clipperFarmingHelperAddress } from "../templates/addresses"
import { Deposit as DepositEvent } from "../types/LinearVestingVault/LinearVestingVault"
import { Deposit } from "../types/schema"

export function handleFarmDeposit(event: DepositEvent): void {
  if (event.params.sender.equals(clipperFarmingHelperAddress)) {
    let deposit = Deposit.load(event.transaction.hash.toHexString())
    if (!deposit) {
      return
    }
  
    deposit.depositor = event.params.owner
    deposit.save()
  }
}

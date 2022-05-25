import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { convertTokenToDecimal } from ".";
import { ClipperCove } from "../../types/ClipperCove/ClipperCove";
import { clipperCoveAddress } from "../addresses";
import { BIG_INT_EIGHTEEN } from "../constants";

export function getCoveBalances(coveAddress: Address, decimals: number): Array<BigDecimal> {
  let coveContract = ClipperCove.bind(clipperCoveAddress)
  let lastBalances = coveContract.lastBalances(coveAddress)
  
  let lpTokens = lastBalances.rightShift(128)
  let mask = (BigInt.fromI32(1).leftShift(128)).minus(BigInt.fromI32(1))
  let tokenBalance = lastBalances.bitAnd(mask)

  let poolTokens = convertTokenToDecimal(lpTokens, BIG_INT_EIGHTEEN)
  let assetBalance = convertTokenToDecimal(tokenBalance, BigInt.fromI32(decimals as i32))
  
  return [poolTokens, assetBalance]
}

// export function get

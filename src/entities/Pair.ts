import { BigDecimal } from '@graphprotocol/graph-ts'
import { Swapped } from '../../types/ClipperDirectExchange/ClipperDirectExchange'
import { Pair } from '../../types/schema'
import { BIG_DECIMAL_ZERO, BIG_INT_ONE, BIG_INT_ZERO } from '../constants'

export function loadPair(inAsset: string, outAsset: string): Pair {
  let pairId = inAsset.concat(outAsset)
  let altPairId = outAsset.concat(inAsset)

  let pair = Pair.load(pairId)

  // load alternative pair id in case first is not found
  if (!pair) {
    pair = Pair.load(altPairId)
  }

  if (!pair) {
    pair = new Pair(pairId)
    pair.asset0 = inAsset
    pair.asset1 = outAsset
    pair.txCount = BIG_INT_ZERO
    pair.volumeUSD = BIG_DECIMAL_ZERO
    pair.save()
  }

  return pair as Pair
}

export function updatePair(inAsset: string, outAsset: string, addedTxVolume: BigDecimal): Pair {
  let pair = loadPair(inAsset, outAsset)
  pair.txCount = pair.txCount.plus(BIG_INT_ONE)
  pair.volumeUSD = pair.volumeUSD.plus(addedTxVolume)

  pair.save()

  return pair
}

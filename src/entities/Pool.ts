import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { DailyPoolStatus, HourlyPoolStatus, Pool } from '../../types/schema'
import { clipperDirectExchangeAddress } from '../addresses'
import { BIG_DECIMAL_ZERO, BIG_INT_ONE, BIG_INT_ZERO, ONE_DAY, ONE_HOUR } from '../constants'
import { getPoolTokenSupply } from '../utils/pool'
import { getOpenTime } from '../utils/timeHelpers'

export function loadPool(): Pool {
  let pool = Pool.load(clipperDirectExchangeAddress.toString())

  if (!pool) {
    pool = new Pool(clipperDirectExchangeAddress.toString())
    pool.avgTrade = BIG_DECIMAL_ZERO
    pool.volumeUSD = BIG_DECIMAL_ZERO
    pool.txCount = BIG_INT_ZERO
    pool.uniqueUsers = BIG_INT_ZERO
    pool.poolTokensSupply = BIG_INT_ZERO

    pool.save()
  }

  return pool as Pool
}

export function updatePoolStatus(timestamp: BigInt, addedTxVolume: BigDecimal, addNewUser: boolean): Pool {
  let pool = loadPool()
  pool.txCount = pool.txCount.plus(BIG_INT_ONE)
  pool.volumeUSD = pool.volumeUSD.plus(addedTxVolume)
  pool.avgTrade = pool.volumeUSD.div(pool.txCount.toBigDecimal())

  if (addNewUser) {
    pool.uniqueUsers = pool.uniqueUsers.plus(BIG_INT_ONE)
  }

  updateDailyPoolStatus(pool, timestamp, addedTxVolume)
  updateHourlyPoolStatus(pool, timestamp, addedTxVolume)

  pool.save()

  return pool
}

function updateDailyPoolStatus(pool: Pool, timestamp: BigInt, addedTxVolume: BigDecimal): DailyPoolStatus {
  let openTime = getOpenTime(timestamp, ONE_DAY)
  let from = openTime
  let to = openTime.plus(ONE_DAY).minus(BIG_INT_ONE)

  let id = clipperDirectExchangeAddress.toString().concat('-')
    .concat(from.toString())
    .concat(to.toString())

  let dailyPoolStatus = DailyPoolStatus.load(id) as DailyPoolStatus
  let poolTokensSupply = getPoolTokenSupply(pool.id)

  // TODO: refactor creating and updating to same function across different intervals (day, hour, etc ...)
  if (!dailyPoolStatus) {
    dailyPoolStatus = new DailyPoolStatus(id)
    dailyPoolStatus.avgTrade = BIG_DECIMAL_ZERO
    dailyPoolStatus.volumeUSD = BIG_DECIMAL_ZERO
    dailyPoolStatus.txCount = BIG_INT_ZERO
    dailyPoolStatus.pool = pool.id
    dailyPoolStatus.from = from
    dailyPoolStatus.to = to
  }

  dailyPoolStatus.txCount = dailyPoolStatus.txCount.plus(BIG_INT_ONE)
  dailyPoolStatus.volumeUSD = dailyPoolStatus.volumeUSD.plus(addedTxVolume)
  dailyPoolStatus.avgTrade = dailyPoolStatus.volumeUSD.div(dailyPoolStatus.txCount.toBigDecimal())
  dailyPoolStatus.poolTokensSupply = poolTokensSupply

  dailyPoolStatus.save()

  return dailyPoolStatus
}

function updateHourlyPoolStatus(pool: Pool, timestamp: BigInt, addedTxVolume: BigDecimal): HourlyPoolStatus {
  let openTime = getOpenTime(timestamp, ONE_HOUR)
  let from = openTime
  let to = openTime.plus(ONE_HOUR).minus(BIG_INT_ONE)

  let id = clipperDirectExchangeAddress.toString().concat('-')
    .concat(from.toString())
    .concat(to.toString())

  let hourlyPoolStatus = HourlyPoolStatus.load(id) as HourlyPoolStatus

  // TODO: refactor creating and updating to same function across different intervals (day, hour, etc ...)
  if (!hourlyPoolStatus) {
    hourlyPoolStatus = new HourlyPoolStatus(id)
    hourlyPoolStatus.avgTrade = BIG_DECIMAL_ZERO
    hourlyPoolStatus.volumeUSD = BIG_DECIMAL_ZERO
    hourlyPoolStatus.txCount = BIG_INT_ZERO
    hourlyPoolStatus.pool = pool.id
    hourlyPoolStatus.from = from
    hourlyPoolStatus.to = to
  }

  hourlyPoolStatus.txCount = hourlyPoolStatus.txCount.plus(BIG_INT_ONE)
  hourlyPoolStatus.volumeUSD = hourlyPoolStatus.volumeUSD.plus(addedTxVolume)
  hourlyPoolStatus.avgTrade = hourlyPoolStatus.volumeUSD.div(hourlyPoolStatus.txCount.toBigDecimal())

  hourlyPoolStatus.save()

  return hourlyPoolStatus
}

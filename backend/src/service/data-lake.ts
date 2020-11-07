import { Snowflake } from 'snowflake-promise'
import { subDays, startOfDay, endOfDay } from 'date-fns/fp'
import { format } from 'date-fns'
import * as R from 'ramda'
import { Review } from './event-hub'

const whitelistedProducts = [
  8569864530471244163,
  -6433072210751770779,
  3283340315810741494,
]

const snowflake = new Snowflake({
  account: process.env.ACCOUNT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  warehouse: 'WH01',
  database: 'DEV_EDW_JUNCTION',
})

type CafePosData = {
  headerId: number
  itemId: number
  headerBookingDate: Date
  headerJournaltime: string
  headerTerminal: string
  headerCashier: string
  headerTotal: number
  itemCode: number
  itemDescription: number
  itemAmount: number
  itemQty: number
  itemUnit: string
  itemNormalPrice: number
  uniqueReviewId?: string
}

export const connect = () => snowflake.connect()

const parseCafePosData = (result: any[]): CafePosData[] =>
  result.map(item => ({
    headerId: Number(item.HEADER_ID),
    itemId: Number(item.ITEM_ID),
    headerBookingDate: new Date(item.HEADER_BOOKINGDATE),
    headerJournaltime: item.HEADER_JOURNALTIME,
    headerTerminal: item.HEADER_TERMINAL,
    headerCashier: item.HEADER_CASHIER,
    headerTotal: Number(item.HEADER_TOTAL),
    itemCode: Number(item.ITEM_CODE),
    itemDescription: Number(item.ITEM_DESCRIPTION),
    itemAmount: Number(item.ITEM_AMT),
    itemQty: Number(item.ITEM_QTY),
    itemUnit: item.ITEM_UNIT,
    itemNormalPrice: Number(item.ITEM_NORMAL_PRICE),
    uniqueReviewId: item.UNIQUEREVIEWID,
  }))

const parseReviewData = (result: any[]): Review[] =>
  result.map(item => ({
    review: Number(item.REVIEW),
    review_ts: new Date(item.REVIEW_TS),
    review_uniqueID: item.REVIEW_UNIQUEID,
  }))

const getCafePosData = (productId: number) =>
  snowflake
    .execute(
      'select * from team_09.cafe_pos_data where HEADER_BOOKINGDATE >= ?',
      [R.pipe(subDays(30), startOfDay)(new Date())]
    )
    .then(parseCafePosData)
    .then(R.filter(({ itemCode }) => itemCode === productId))

const getNewCafePosData = (productId: number) =>
  snowflake
    .execute(
      `select * from x_pub_team_09.cafe_pos_data_v${process.env.TABLEVERSION}`,
      [productId]
    )
    .then(parseCafePosData)
    .then(
      R.filter(
        ({ headerBookingDate, itemCode }) =>
          productId === itemCode &&
          headerBookingDate >= R.pipe(subDays(30), startOfDay)(new Date())
      )
    )

const getReviewsByIds = (uniqueIds: string[]) =>
  snowflake
    .execute(
      `select * from x_pub_team_09.review_data_v${process.env.TABLEVERSION}`
    ) // shit library. doesn't support arrays as input
    .then(parseReviewData)
    .then(
      R.filter(({ review_uniqueID }) => uniqueIds.includes(review_uniqueID))
    )

const resolveLast30Days = (events: CafePosData[]) => {
  const now = new Date()
  const scanEnd = R.pipe(subDays(1), endOfDay)
  const scanBegin = R.pipe(subDays(30), startOfDay)

  return R.pipe(
    (events: CafePosData[]) =>
      R.filter(
        ({ headerBookingDate }) =>
          headerBookingDate >= scanBegin(now) &&
          headerBookingDate <= scanEnd(now),
        events
      ),
    R.groupBy(({ headerBookingDate }) =>
      format(headerBookingDate, 'dd.LL.yyyy')
    ),
    R.mapObjIndexed(i => i.reduce((p, c) => p + c.itemQty, 0))
  )(events)
}

const resolveConsumedToday = (events: CafePosData[]) => {
  const now = new Date()
  return events
    .filter(({ headerBookingDate }) => headerBookingDate >= startOfDay(now))
    .reduce((p, c) => p + c.itemQty, 0)
}

const resolveSatisfaction = (events: CafePosData[]) => {
  const reviewIds = events
    .map(({ uniqueReviewId }) => uniqueReviewId)
    .filter(i => !!i)
  return getReviewsByIds(R.uniq(reviewIds)).then(
    reviews =>
      (R.sum(reviews.map(({ review }) => review)) / reviews.length) * 10
  )
}

/*
  We need to handle productId as a number, because it overflows because the datatype is integer
  in the database.
*/
export const getInsightsForProduct = (productId: number) =>
  Promise.all([getCafePosData(productId), getNewCafePosData(productId)])
    .then(([oldData, newData]) => [...newData, ...oldData])
    .then(async data => ({
      id: productId,
      consumedToday: resolveConsumedToday(data),
      consumedLastMonth: resolveLast30Days(data),
      satisfaction: await resolveSatisfaction(data),
    }))

export const getProducts = () =>
  Promise.all([
    snowflake.execute('select distinct(ITEM_CODE) from team_09.cafe_pos_data'),
    snowflake.execute(
      `select distinct(ITEM_CODE) from x_pub_team_09.cafe_pos_data_v${process.env.TABLEVERSION}`
    ),
  ])
    .then(([p1, p2]) => [...p1, ...p2])
    .then(
      R.pipe(
        R.map(({ ITEM_CODE }) => Number(ITEM_CODE)),
        R.filter<number>(i => whitelistedProducts.includes(i)),
        R.uniq
      )
    )

export const checkReviewCode = (code: string) =>
  snowflake
    .execute(
      `select UNIQUEREVIEWID from x_pub_team_09.cafe_pos_data_v${process.env.TABLEVERSION} where UNIQUEREVIEWID = ?`,
      [code]
    )
    .then(result => (result.length === 0 ? false : true))

import { Snowflake } from 'snowflake-promise'
import { subDays, startOfDay, endOfDay } from 'date-fns/fp'
import { format } from 'date-fns'
import * as R from 'ramda'

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
    .execute('select * from x_pub_team_09.cafe_pos_data_v3', [productId])
    .then(parseCafePosData)
    .then(
      R.filter(
        ({ headerBookingDate, itemCode }) =>
          productId === itemCode &&
          headerBookingDate >= R.pipe(subDays(30), startOfDay)(new Date())
      )
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
    R.mapObjIndexed(i => i.length)
  )(events)
}

const resolveConsumedToday = (events: CafePosData[]) => {
  const now = new Date()
  return events.filter(
    ({ headerBookingDate }) => headerBookingDate >= startOfDay(now)
  ).length
}

/*
  We need to handle productId as a number, because it overflows because the datatype is integer
  in the database.
*/
export const getInsightsForProduct = (productId: number) =>
  Promise.all([getCafePosData(productId), getNewCafePosData(productId)])
    .then(([oldData, newData]) => {
      console.log(newData)
      return [...newData, ...oldData]
    })
    .then(data => ({
      id: productId,
      consumedToday: resolveConsumedToday(data),
      consumedLastMonth: resolveLast30Days(data),
    }))

export const getProducts = () =>
  snowflake
    .execute('select distinct(ITEM_CODE) from cafe_pos_data')
    .then(data => data.map(({ ITEM_CODE }) => ITEM_CODE))

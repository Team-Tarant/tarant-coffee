import { Snowflake } from 'snowflake-promise'
import { subDays, startOfDay, endOfDay } from 'date-fns/fp'
import { format } from 'date-fns'
import * as R from 'ramda'

const snowflake = new Snowflake({
  account: process.env.ACCOUNT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  schema: 'TEAM_09',
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
/*
type WebshopData = {
  address: string
  city: string
  country: string
  customerName: string
  orderQuantity: number
  orderTime: Date
  productCode: number
  productSubgroup: string
  revenue: number
  zipCode: string
  orderNumber: number
}
*/
export const connect = () => snowflake.connect()

const parseCafePosData = (result: any[]): CafePosData[] =>
  result.map(item => ({
    headerId: item.HEADER_ID,
    itemId: item.ITEM_ID,
    headerBookingDate: item.HEADER_BOOKINGDATE,
    headerJournaltime: item.HEADER_JOURNALTIME,
    headerTerminal: item.HEADER_TERMINAL,
    headerCashier: item.HEADER_CASHIER,
    headerTotal: item.HEADER_TOTAL,
    itemCode: item.ITEM_CODE,
    itemDescription: item.ITEM_DESCRIPTION,
    itemAmount: item.ITEM_AMT,
    itemQty: item.ITEM_QTY,
    itemUnit: item.ITEM_UNIT,
    itemNormalPrice: item.ITEM_NORMAL_PRICE,
  }))
/*
const parseWarehouseData = (result: any[]): WebshopData[] =>
  result.map(item => ({
    address: item.ADDRESS,
    city: item.CITY,
    country: item.COUNTRY,
    customerName: item.CUSTOMER_NAME,
    orderQuantity: item.ORDER_QUANTITY,
    orderTime: item.ORDER_TIME,
    productCode: item.PRODUCT_CODE,
    productSubgroup: item.PRODUCT_NAME,
    revenue: item.REVENUE,
    zipCode: item.ZIP_CODE,
    orderNumber: item.ORDER_NUMBER,
  }))
*/
const getCafePosData = (productId: number) =>
  snowflake
    .execute('select * from cafe_pos_data where HEADER_BOOKINGDATE >= ?', [
      R.pipe(subDays(30), startOfDay)(new Date()),
    ])
    .then(parseCafePosData)
    .then(R.filter(({ itemCode }) => itemCode === productId))
/*
const getWarehouseData = () =>
  snowflake.execute('select * from webshop_data').then(parseWarehouseData)
*/

/*
const getCafePosDataForProduct = (productId: string) =>
  snowflake
    .execute('select * from cafe_pos_data where ITEM_CODE = ?', [productId])
    .then(parseCafePosData)
    */

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

export const getInsightsForProduct = (productId: number) =>
  getCafePosData(productId).then(data => ({
    id: productId,
    consumedToday: resolveConsumedToday(data),
    consumedLastMonth: resolveLast30Days(data),
  }))

export const getProducts = () =>
  snowflake
    .execute('select distinct(ITEM_CODE) from cafe_pos_data')
    .then(data => data.map(({ ITEM_CODE }) => ITEM_CODE))

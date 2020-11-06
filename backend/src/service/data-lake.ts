import { Snowflake } from 'snowflake-promise'

const snowflake = new Snowflake({
  account: process.env.ACCOUNT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  schema: 'JUNCTION_2020',
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

export const getCafePosData = () =>
  snowflake.execute('select * from cafe_pos_data').then(parseCafePosData)

export const getWarehouseData = () =>
  snowflake.execute('select * from webshop_data').then(parseWarehouseData)

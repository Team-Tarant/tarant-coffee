import { EventHubProducerClient } from '@azure/event-hubs'
import { v4 as uuidv4 } from 'uuid'
import { randomBytes } from 'crypto'

const producerClient = new EventHubProducerClient(
  process.env.EVENTHUB_CONNECTION
)

export type Review = {
  review_uniqueID: string
  review: number
  review_ts: Date
}

type Purchase = {
  HEADER_ID: string
  ITEM_ID: string
  HEADER_BOOKINGDATE: Date
  HEADER_JOURNALTIME: Date
  HEADER_TERMINAL: string
  HEADER_CASHIER: string
  HEADER_TOTAL: number
  ITEM_CODE: number
  ITEM_DESCRIPTION: string
  ITEM_AMT: number
  ITEM_QTY: number
  ITEM_UNIT: string
  ITEM_NORMAL_PRICE: number
}

type completePurchase = {
  uniqueReviewId: string
} & Purchase

type Event = {
  event_data: Purchase | Review
  event_domain: string
  event_id: string
  event_source: string
  event_ts: Date
  event_type: string
}

const generateEvent = (
  eventType: string,
  eventData: completePurchase | Review //| any
) => {
  return {
    event_data: eventData,
    event_domain: 'team_09',
    event_id: uuidv4(),
    event_source: 'tarant-coffee',
    event_ts: new Date(),
    event_type: eventType,
  }
}

export const getEventHubProperties = async () =>
  await producerClient.getEventHubProperties()

export const postEvent = async (event: Event) => {
  const eventDataBatch = await producerClient.createBatch()
  await eventDataBatch.tryAdd({ body: event })
  await producerClient.sendBatch(eventDataBatch)
}

// export const postCustomEvent = async (eventType: string, eventData: any) => {
//   const event = generateEvent(eventType, eventData)
//   await postEvent(event)
// }

export const postPurchase = async (body: Purchase) => {
  const uniqueReviewId = randomBytes(3).toString('hex')
  const purchaseEvent = generateEvent(
    `cafe_pos_data_v${process.env.TABLEVERSION}`,
    {
      ...body,
      uniqueReviewId,
    }
  )
  await postEvent(purchaseEvent)
  return uniqueReviewId
}

export const postReview = async (body: Review) => {
  const reviewEvent = generateEvent(
    `review_data_v${process.env.TABLEVERSION}`,
    body
  )
  await postEvent(reviewEvent)
}

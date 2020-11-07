import { EventHubProducerClient } from '@azure/event-hubs'

const producerClient = new EventHubProducerClient(
  process.env.EVENTHUB_CONNECTION
)

// type Review = {
//   review_uniqueID: string
//   review: number
//   review_ts: Date
// }

// type Purchase = {
//   HEADER_ID: string
//   ITEM_ID: string
//   HEADER_BOOKINGDATE: Date
//   HEADER_JOURNALTIME: Date
//   HEADER_TERMINAL: string
//   HEADER_CASHIER: string
//   HEADER_TOTAL: number
//   ITEM_CODE: number
//   ITEM_DESCRIPTION: string
//   ITEM_AMT: number
//   ITEM_QTY: number
//   ITEM_UNIT: string
//   ITEM_NORMAL_PRICE: number
//   REVIEW_UNQIUE_KEY: string
// }

type Event = {
  event_data: any
  event_domain: string
  event_id: string
  event_source: string
  event_ts: Date
  event_type: string
}

export const getEventHubProperties = async () =>
  await producerClient.getEventHubProperties()

export const postEvent = async (event: Event) => {
  const eventDataBatch = await producerClient.createBatch()
  await eventDataBatch.tryAdd({ body: event })
  await producerClient.sendBatch(eventDataBatch)
}

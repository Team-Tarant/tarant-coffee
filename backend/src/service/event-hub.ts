import {
  EventHubProducerClient,
  EventHubConsumerClient,
  earliestEventPosition,
} from '@azure/event-hubs'

const producerClient = new EventHubProducerClient(
  process.env.EVENTHUB_CONNECTION
)

const consumerClient = new EventHubConsumerClient(
  process.env.EVENTHUB_CONSUMER_GROUP,
  process.env.EVENTHUB_CONNECTION
)

const subscriptionOptions = {
  startPosition: earliestEventPosition,
}

type Event = {
  event_data: {
    purchaseId: string
    boughtItems: string[]
    bought_ts: Date
  }
  event_domain: string
  event_id: string
  event_source: string
  event_ts: Date
  event_type: string
}

export const getPartitionIds = () => producerClient.getPartitionIds()

export const subscription = async () => {
  let partitionIds = await consumerClient.getPartitionIds()
  consumerClient.subscribe(
    partitionIds[0],
    {
      processEvents: (events, context) => {
        console.log('Received event count: ', events.length)
        return Promise.resolve()
      },
      processError: (err, context) => {
        console.log('Error: ', err)
        return Promise.resolve()
      },
    },
    subscriptionOptions
  )
}

export const postEvent = async (event: Event) => {
  const eventDataBatch = await producerClient.createBatch()
  await eventDataBatch.tryAdd({ body: event })
  await producerClient.sendBatch(eventDataBatch)
}

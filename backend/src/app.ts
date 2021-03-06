import dotenv from 'dotenv'
dotenv.config()
import {
  checkReviewCode,
  connect,
  getInsightsForProduct,
  getProducts,
} from './service/data-lake'
import {
  getEventHubProperties,
  postPurchase,
  postReview,
  //postCustomEvent,
} from './service/event-hub'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

connect()
  .then(() => console.log('Connected to snowflake'))
  .catch(e => {
    console.error('Error connecting to snowflake', e)
  })

app.get('/api/insights/:productId', (req, res) => {
  if (!req.params.productId)
    return res.status(400).json({ error: 'Missing productId path param' })
  getInsightsForProduct(Number(req.params.productId)).then(insights =>
    res.json(insights)
  )
})

app.get('/api/products', (req, res) =>
  getProducts().then(products => res.json(products))
)

app.get('/api/eventhub-info', (req, res) =>
  getEventHubProperties().then(data => res.json(data))
)

app.post('/api/purchase', (req, res) =>
  postPurchase(req.body)
    .then(uniqueReviewId => res.json({ uniqueReviewId }))
    .catch(err => console.error(err))
)

app.post('/api/review', (req, res) =>
  postReview(req.body)
    .then(() => res.json('Review posted succesfully'))
    .catch(err => console.error(err))
)

// app.post('/api/custom/:eventType', (req, res) =>
//   postCustomEvent(req.params.eventType, req.body)
//     .then(() => res.json('Custom data posted successfully'))
//     .catch(err => console.error(err))
// )

app.get('/api/review/checkCode', (req, res) =>
  checkReviewCode(req.query.code.toString()).then(result =>
    res.json({ result })
  )
)

app.listen(3000, () => console.log('Listening on', PORT, '💩'))

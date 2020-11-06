import dotenv from 'dotenv'
dotenv.config()
import {
  connect,
  getInsightsForProduct,
  startCafePosDataPoll,
} from './service/data-lake'
import express from 'express'

const app = express()

const PORT = process.env.PORT || 3000

connect()
  .then(() => console.log('Connected to snowflake'))
  .then(() => startCafePosDataPoll(30000))
  .catch(e => {
    console.error('Error connecting to snowflake', e)
  })

app.get('/api/insights/:productId', (req, res) => {
  if (!req.params.productId)
    return res.status(400).json({ error: 'Missing productId path param' })
  res.json(getInsightsForProduct(Number(req.params.productId)))
})

app.listen(3000, () => console.log('Listening on', PORT, '💩'))

import dotenv from 'dotenv'
dotenv.config()
import {
  connect,
  getInsightsForProduct,
  getProducts,
} from './service/data-lake'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

const PORT = process.env.PORT || 3000

connect()
  .then(() => console.log('Connected to snowflake'))
  .catch(e => {
    console.error('Error connecting to snowflake', e)
  })

app.get('/api/insights/:productId', (req, res) => {
  if (!req.params.productId)
    return res.status(400).json({ error: 'Missing productId path param' })
  getInsightsForProduct(Number(req.params.productId)).then(insights => res.json(insights))
})

app.get('/api/products', (req, res) =>
  getProducts().then(products => res.json(products))
)

app.listen(3000, () => console.log('Listening on', PORT, '💩'))

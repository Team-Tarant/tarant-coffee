import dotenv from 'dotenv'
dotenv.config()
import { getCafePosData, connect, getWarehouseData } from './service/data-lake'
import express from 'express'

const app = express()

const PORT = process.env.PORT || 3000

connect()
  .then(() => console.log('Connected to snowflake'))
  .catch(e => {
    console.error('Error connecting to snowflake', e)
  })

app.get('/api/cafe', (req, res) =>
  getCafePosData().then(data => res.json(data))
)

app.get('/api/warehouse', (req, res) =>
  getWarehouseData().then(data => res.json(data))
)

app.listen(3000, () => console.log('Listening on', PORT, '💩'))

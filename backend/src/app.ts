import dotenv from 'dotenv'
dotenv.config()
import { getCafePosData, connect, getWarehouseData } from './service/data-lake'
import { postEvent, getEventHubProperties } from './service/event-hub'
import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())

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

app.get('/api/eventhub-info', (req, res) =>
  getEventHubProperties().then(data => res.json(data))
)

app.post('/api/post', (req, res) =>
  postEvent(req.body)
    .then(() => res.json('post successfull'))
    .catch(err => console.error(err))
)

app.listen(3000, () => console.log('Listening on', PORT, '💩'))

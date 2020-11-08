const mockjson = require('./purchase_mock_data.json') // generated with https://mockaroo.com/
const axios = require('axios')
const { setHour, setHours } = require('date-fns')
const reviews = [-1, 0, 1]

const scuffedRand = () => {
  let rand = Math.random()
  if (rand < 0.1) return -1
  if (rand < 0.2) return 0
  return 1
}

const scuffedTime = original => {
  const rand = Math.random()

  if (rand < 0.5) {
    return setHours(original, 6 + Math.floor(Math.random() * 3))
  }

  if (rand < 0.3) {
    return setHours(original, 12)
  }

  return original
}

async function postPurchase() {
  const randPurchase = mockjson[Math.floor(Math.random() * mockjson.length)]
  randPurchase.HEADER_BOOKINGDATE = new Date()
  await axios
    .post('http://localhost:3000/api/purchase', randPurchase)
    .then(res => res.data)
    .then(({ uniqueReviewId }) => {
      console.log({ uniqueReviewId })
      axios.post('http://localhost:3000/api/review', {
        review_uniqueID: uniqueReviewId,
        review: scuffedRand(),
        review_ts: randPurchase.HEADER_BOOKINGDATE,
      })
    })
}

//setInterval(postPurchase, 15000);

// For demo purposes. Give an JSON file with valid purchase events and iterate through it 1 request at a time. Takes around 1min for 1000 requests
// purchase event returns the uniqueReviewID, which is then used to post the review event
async function app() {
  for (const purchase of mockjson) {
    const newPurchase = {
      ...purchase,
      ITEM_QTY:
        purchase.ITEM_CODE === Number('8569864530471243776')
          ? Math.floor(Math.random() * 100)
          : purchase.ITEM_QTY,
      HEADER_BOOKINGDATE: scuffedTime(new Date(purchase.HEADER_BOOKINGDATE)),
    }
    await axios
      .post('http://localhost:3000/api/purchase', newPurchase)
      .then(res => res.data)
      .then(({ uniqueReviewId }) => {
        console.log({ uniqueReviewId })
        axios.post('http://localhost:3000/api/review', {
          review_uniqueID: uniqueReviewId,
          review: scuffedRand(),
          review_ts: newPurchase.HEADER_BOOKINGDATE,
        })
      })
  }
}

app()

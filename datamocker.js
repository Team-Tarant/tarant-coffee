const mockjson = require("./purchase_mock_data.json"); // generated with https://mockaroo.com/
const axios = require("axios");
const reviews = [-1, 0, 1];

const scuffedRand = () => {
  let rand = Math.random();
  if (rand < 0.1) return -1;
  if (rand < 0.2) return 0;
  return 1;
};

// For demo purposes. Give an JSON file with valid purchase events and iterate through it 1 request at a time. Takes around 1min for 1000 requests
// purchase event returns the uniqueReviewID, which is then used to post the review event
async function app() {
  for (const purchase of mockjson) {
    await axios
      .post("http://localhost:3000/api/purchase", purchase)
      .then((res) => res.data)
      .then(({ uniqueReviewId }) => {
        console.log({ uniqueReviewId });
        axios.post("http://localhost:3000/api/review", {
          review_uniqueID: uniqueReviewId,
          review: scuffedRand(),
          review_ts: purchase.HEADER_BOOKINGDATE,
        });
      });
  }
}

app();

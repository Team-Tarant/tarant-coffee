import axios from 'axios';

const baseUrl = 'http://localhost:3000/api';

export const fetchProductData = async (productId: number) => {
  const result = await axios(baseUrl + '/insights/' + productId?.toString());
  return result.data;
};

export const fetchProducts = async () => {
  const result = await axios(baseUrl + '/products');
  return result.data;
};

export const checkCode = async (id: string) => {
  const result = await axios(baseUrl + '/review/checkCode?code=' + id);
  return result.data;
};

export const sendFeedback = async (id: string, rating: number) => {
  const result = await axios.post(baseUrl + '/review', {
    review_uniqueID: id,
    review: rating,
    review_ts: new Date(),
  });
  return result;
};

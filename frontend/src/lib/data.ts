import axios from 'axios'

export const fetchProductData = async (productId: number) => {
  const result = await axios(
    'http://localhost:3000/api/insights/'+ productId?.toString()
  )
  return result.data
}

export const fetchProducts = async () => {
  const result = await axios(
    'http://localhost:3000/api/products'
  )
  return result.data
}
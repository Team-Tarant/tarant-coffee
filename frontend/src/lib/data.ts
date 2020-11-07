import axios from 'axios'

const baseUrl = 'http://localhost:3000/api'

export const fetchProductData = async (productId: number) => {
  const result = await axios(
    baseUrl + '/insights/'+ productId?.toString()
  )
  return result.data
}

export const fetchProducts = async () => {
  const result = await axios(
    baseUrl + '/products'
  )
  return result.data
}
import React, { useState, useEffect } from 'react'

import { fetchProducts } from '../lib/data'
import Select from 'react-select'

type Props = {
  setProductId: (id: number | null) => void,
  setProductName: (name: string | null) => void,
}

const ProductSelect = ({setProductId, setProductName}: Props) => {
  const [products, setProducts] = useState<any>([])
  const [selectOptions, setSelectOptions] = useState<any>()

  useEffect(() => {
    fetchProducts().then(setProducts)
  },[])

  useEffect(() => {
    setSelectOptions(products.map(p => { return {value: p.productId.toString(), label: p.productName}}))
  },[products])

  return <Select options={selectOptions} onChange={option => {
    setProductId(option.value)
    setProductName(option.label)
  }}/>
}

export default ProductSelect


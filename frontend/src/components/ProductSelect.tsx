import React, { useState, useEffect } from 'react'

import { fetchProducts } from '../lib/data'
import Select from 'react-select'

type Props = {
  setProduct: (id: number | null) => void,
}

const ProductSelect = ({setProduct}: Props) => {
  const [products, setProducts] = useState<any>([])
  const [selectOptions, setSelectOptions] = useState<any>()

  useEffect(() => {
    fetchProducts().then(setProducts)
  },[])

  useEffect(() => {
    setSelectOptions(products.map(p => { return {value: p.toString(), label: p.toString()}}))
  },[products])

  return <Select options={selectOptions} onChange={option => setProduct(option.value)}/>
}

export default ProductSelect


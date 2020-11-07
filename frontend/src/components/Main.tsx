import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import ProductSelect from './ProductSelect'
import Product from './Product'

import { fetchProductData } from '../lib/data'

import { Theme } from '../styles'

type Props = {}

type Insights = {
  consumedLastMonth: { [key: string]: number },
  consumedToday: number,
  id: number,
}

const Main: React.FC<Props> = ({ }) => {
  const [productId, setProductId] = useState<number | null>(null)
  const [productData, setProductData] = useState<Insights | null>(null)

  useEffect(() => {
    if (productId) {
      setProductData(null)
      fetchProductData(productId).then(setProductData)
    }
  }, [productId])

  return (
    <Col>
      <Col>
        <ProductSelect setProduct={setProductId} />
        {productId && !productData ? <Loading /> :
          productId &&
          <div>
            {productData &&
              <Product productData={productData} />
            }
          </div>

        }
      </Col>
    </Col>
  )
}

const Col: any = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 5px;
`;

const Row: any = styled.div`
  display:flex;
  flex-direction: row;
`

const Loading: any = styled.img.attrs(() => ({
  src: require('../assets/LoadingIndicator.svg').default,
}))`
  color: ${Theme.color.secondary};
  width: 10rem;
  margin: auto;
`;

export default Main;

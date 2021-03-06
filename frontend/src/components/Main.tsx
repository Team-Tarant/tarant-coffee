import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import ProductSelect from './ProductSelect'
import Product from './Product'

import { fetchProductData } from '../lib/data'

import { Theme } from '../styles'

type Props = {}

export type Insights = {
  consumedLastMonth: { [key: string]: number },
  consumedToday: number,
  id: number,
  satisfaction: number,
  todTrend: {[key: string]: {[key:string]: number}},
}

const Main: React.FC<Props> = ({ }) => {
  const [productId, setProductId] = useState<number | null>(null)
  const [productName, setProductName] = useState<string | null>(null)
  const [productData, setProductData] = useState<Insights | null>(null)

  useEffect(() => {
    if (productId) {
      setProductData(null)
      fetchProductData(productId).then(setProductData)
    }
  }, [productId])

  useEffect(() => {
    const interval = setInterval(() => {
      if (productId)
        fetchProductData(productId).then(setProductData)
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [productId]);

  return (
    <Col>
      <Col>
        <ProductSelect setProductId={setProductId} setProductName={setProductName} />
        {productId && !productData ? <Loading /> :
          productId &&
          <div>
            {productData && productName &&
              <Product productData={productData} productName={productName} />
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

const Loading: any = styled.img.attrs(() => ({
  src: require('../assets/LoadingIndicator.svg').default,
}))`
  color: ${Theme.color.secondary};
  width: 10rem;
  margin: auto;
`;

export default Main;

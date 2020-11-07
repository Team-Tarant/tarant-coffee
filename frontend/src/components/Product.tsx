import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

import InfoLabel from './InfoLabel'
import LastMonthChart from './LastMonthChart'
import { Theme } from '../styles'
import { Insights } from './Main'

type Props = {
  productData: Insights,
  productName: string,
}

const getPreviousDaySales = (consumedLastMonth: { [key: string]: number }): number => {
  const yesterday: moment.Moment = moment().subtract(1, 'days')

  return consumedLastMonth[yesterday.format('DD.MM.YYYY')] || 0
}

const Product: React.FC<Props> = ({ productData, productName }) => {
  const { id, consumedToday, consumedLastMonth, satisfaction } = productData
  const soldYesterday: number = getPreviousDaySales(consumedLastMonth)
  return (
    <div>
      <Heading>{productName}</Heading>
      <Container>
        <InfoLabel label={'sold today'} value={consumedToday} />
        <InfoLabel label={'sold yesterday'} value={soldYesterday} />
        <InfoLabel label={'satisfaction'} value={satisfaction} />
        <LastMonthChart consumedLastMonth={consumedLastMonth} />
      </Container>
    </div>
  )
}

const Container: any = styled.div`
  display: flex;
  margin: 5px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
`;

const Heading: any = styled.p`
  color: ${Theme.color.primary};
  font-family: ${Theme.font.secondary};
  font-size: 3rem;
  margin: 0;
`

export default Product;
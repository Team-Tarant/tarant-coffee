import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

import InfoLabel from './InfoLabel'
import LastMonthChart from './LastMonthChart'
import TodTrendChart from './TodTrendChart'
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
  const { id, consumedToday, consumedLastMonth, satisfaction, todTrend } = productData
  const soldYesterday: number = getPreviousDaySales(consumedLastMonth)
  return (
    <div>
      <Heading>{productName}</Heading>
      <Container>
        <Row>
          <InfoLabel label={'sold today'} value={consumedToday} />
          <InfoLabel label={'sold yesterday'} value={soldYesterday} />
          <InfoLabel label={'customer rating'} value={`${satisfaction.toFixed(2)}/10`} />
        </Row>
        <LastMonthChart consumedLastMonth={consumedLastMonth} />
        <TodTrendChart todTrend={todTrend} />
      </Container>
    </div>
  )
}

const Container: any = styled.div`
  display: flex;
  margin: 5px;
  flex-direction: column;
`;


const Row: any = styled.div`
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 5px 0;
`

const Heading: any = styled.p`
  color: ${Theme.color.primary};
  font-family: ${Theme.font.secondary};
  font-size: 3rem;
  margin: 0;
`

export default Product;
import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import moment from 'moment'

import styled from 'styled-components'


type Props = {
  consumedLastMonth: {[key: string]:number},
}

const getSalesDateArrays = (consumedLastMonth: {[key: string]:number}): {sales: number[], dates: string[]} => {
  const sales: number[] = [], dates: string[] = []
  let date: moment.Moment = moment()
  for (let i = 0; i < 30; i++) {
    date.subtract(1,'days')
    dates.unshift(date.format('DD.MM.'))
    sales.unshift(consumedLastMonth[date.format('DD.MM.YYYY')] || 0)
  }
  return { sales, dates }
}

const LastMonthChart:React.FC<Props> = ({ consumedLastMonth }) => {
  const { sales, dates } = getSalesDateArrays(consumedLastMonth)

  const [options, setOptions] = useState({
    chart: {
      id: 'last-month-chart'
    },
    xaxis: {
      categories: dates
    }
  })
  
  const [series, setSeries] = useState({
    series: [{
      name: 'sales',
      data: sales
    }]
  })

  const [width, setWidth] = useState(window.innerWidth > 900 ? 900 : window.innerWidth * 0.9)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth > 900 ? 900 : window.innerWidth * 0.9)
    }

  window.addEventListener("resize", handleResize)
  
  handleResize()

  return () => window.removeEventListener("resize", handleResize)
}, [])

  return (
    <ChartBlock>
      <Chart
        options={options}
        series={series.series}
        type="line"
        width={width}
        />
    </ChartBlock>
  )
}

const ChartBlock: any = styled.div`
  background-color: white;
`

export default LastMonthChart
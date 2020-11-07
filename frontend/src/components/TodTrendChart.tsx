import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Chart from 'react-apexcharts'

import { Theme } from '../styles'


const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

type Props = {
  todTrend: {[key: string]: {[key:string]: number}}
}

const TodTrendChart:React.FC<Props> = ({todTrend}) => {
  const [width, setWidth] = useState(window.innerWidth > 900 ? 900 : window.innerWidth * 0.9)

  const series = days.map(d => {
    const day = todTrend[d]
    const statsByHour:any[] = []
    for (let i = 0; i < 24; i++) {
      let hString: string = i.toString()
      hString = i < 10 ? '0'+ hString : hString
      statsByHour.unshift({ x:hString, y:day[hString] || 0 })
    }

    return { name: d, data: statsByHour.reverse() }
  })

  const options = {
    chart: {
      height: 350,
      type: 'heatmap',
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#008FFB"],
    title: {
      text: 'Sales by time of day'
    },
  }

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
        series={series}
        type="heatmap"
        height={350}
        width={width}/>
    </ChartBlock>
  )
}

const ChartBlock: any = styled.div`
  background-color: ${ Theme.color.tertiary };
  border-radius: 1rem;
  margin: 5px 0;
`

export default TodTrendChart
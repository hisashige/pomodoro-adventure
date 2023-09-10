import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
} from 'recharts'

import { Button, Flex } from '@mantine/core'
import { Log } from '../../../../contexts/LogContext'

interface MyChartProps {
  data: ChartData[]
  xAxisLabel: string
}

const MyChart = ({ data, xAxisLabel }: MyChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={500} height={300} data={data} maxBarSize={25}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          angle={-45}
          tick={{ fontSize: 12, dy: -1 }}
          interval={0}
          textAnchor="end"
          height={60}
        >
          <Label value={xAxisLabel} offset={0} position="insideBottomRight" />
        </XAxis>
        <YAxis />
        <Tooltip />
        <Legend align="left" verticalAlign="top" height={50} />
        <Bar name="Times(分)" dataKey="totalMinutes" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

interface ChartData {
  date: string
  totalMinutes: number
}

interface Props {
  logs: Log[]
}

export default function ChartSwitcher({ logs }: Props) {
  // 日付ごとにデータを集計
  const dailyData: ChartData[] = logs.reduce((result, log) => {
    const date = log.startTime.split(' ')[0]
    const existingData = result.find((item) => item.date === date)

    if (existingData) {
      existingData.totalMinutes += log.minutes
    } else {
      result.push({ date, totalMinutes: log.minutes })
    }

    return result
  }, [] as ChartData[])

  // 週ごとにデータを集計
  const weeklyData: ChartData[] = logs.reduce((result, log) => {
    const logDate = new Date(log.startTime)
    const weekStartDate = new Date(logDate)
    weekStartDate.setDate(logDate.getDate() - logDate.getDay())
    const weekKey = `${weekStartDate.getFullYear()}-${
      weekStartDate.getMonth() + 1
    }-${weekStartDate.getDate()}`
    const existingData = result.find((item) => item.date === weekKey)

    if (existingData) {
      existingData.totalMinutes += log.minutes
    } else {
      result.push({ date: weekKey, totalMinutes: log.minutes })
    }

    return result
  }, [] as ChartData[])

  // 月ごとにデータを集計
  const monthlyData: ChartData[] = logs.reduce((result, log) => {
    const logDate = new Date(log.startTime)
    const monthKey = `${logDate.getFullYear()}-${logDate.getMonth() + 1}`
    const existingData = result.find((item) => item.date === monthKey)

    if (existingData) {
      existingData.totalMinutes += log.minutes
    } else {
      result.push({ date: monthKey, totalMinutes: log.minutes })
    }

    return result
  }, [] as ChartData[])

  const [chartType, setChartType] = useState('daily') // デフォルトは日ごと

  let chartData: ChartData[] = []
  let xAxisLabel = ''

  switch (chartType) {
    case 'daily':
      chartData = dailyData
      xAxisLabel = '日ごと'
      break
    case 'weekly':
      chartData = weeklyData
      xAxisLabel = '週ごと'
      break
    case 'monthly':
      chartData = monthlyData
      xAxisLabel = '月ごと'
      break
    default:
      break
  }

  return (
    <>
      <Flex style={{ height: '100%' }}>
        <MyChart data={chartData} xAxisLabel={xAxisLabel} />
        <Flex justify="center" align="flex-start" direction="column" gap="sm" wrap="wrap" pr={5}>
          <Button
            onClick={() => setChartType('daily')}
            variant={chartType === 'daily' ? 'filled' : 'light'}
          >
            日
          </Button>
          <Button
            onClick={() => setChartType('weekly')}
            variant={chartType === 'weekly' ? 'filled' : 'light'}
          >
            週
          </Button>
          <Button
            onClick={() => setChartType('monthly')}
            variant={chartType === 'monthly' ? 'filled' : 'light'}
          >
            月
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

interface RadarItem {
  level: number
  id: number
  name: string
  totalMinutes: number
  delete: boolean
}

interface Props {
  questsForRadar: RadarItem[]
}

export default function QuestRadar({ questsForRadar }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={questsForRadar}>
        <PolarGrid gridType="circle" />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis domain={[0, 10]} />
        <Radar
          name="Quest Level"
          dataKey="level"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Legend align="left" verticalAlign="top" />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  )
}

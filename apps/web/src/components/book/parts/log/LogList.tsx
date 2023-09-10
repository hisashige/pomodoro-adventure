import { Paper, ScrollArea, Table } from '@mantine/core'
import { useQuestContext } from '../../../../contexts/QuestContext'
import { Log } from '../../../../contexts/LogContext'
import { isWithinPomodoroMinutes } from '../../../../libs/dateUtils'

interface Props {
  filteredLogs: Log[]
}
export default function LogList({ filteredLogs }: Props) {
  const { questList } = useQuestContext()

  const statusLabel = (log: Log) => {
    if (log.done) {
      return '完了'
    } else {
      if (isWithinPomodoroMinutes(log.startTime)) {
        return 'クエスト中'
      } else {
        return '中断'
      }
    }
  }

  const questNameLabel = (log: Log) => {
    const targetLog = questList.find((item) => item.id === log.questId)
    let label = ''
    if (targetLog) {
      label = targetLog.name
      if (targetLog.delete) label = label + '(削除済)'
    }
    return label
  }

  const rows = filteredLogs.map((log) => (
    <tr key={log.id}>
      <td>{log.enemy}</td>
      <td>{questNameLabel(log)}</td>
      <td>{statusLabel(log)}</td>
      <td>{log.startTime}</td>
    </tr>
  ))

  return (
    <Paper withBorder radius="md" p="md" m="xs" style={{ height: '70vh' }}>
      <ScrollArea style={{ height: '100%' }}>
        <Table>
          <thead>
            <tr>
              <th>エネミー</th>
              <th>クエスト</th>
              <th>状態</th>
              <th>開始日時</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </Paper>
  )
}

import {
  Paper,
  TextInput,
  Text,
  List,
  Box,
  UnstyledButton,
  Tooltip,
  ActionIcon,
  Group,
} from '@mantine/core'
import { useLogContext } from '../../../../contexts/LogContext'
import { useMemo } from 'react'
import { IconInfoCircle } from '@tabler/icons-react'

interface Props {
  isRunning: boolean
}

export default function Enemy({ isRunning }: Props) {
  const { enemy, setEnemy, logs } = useLogContext()
  const handleChangeEnemy = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnemy(e.target.value)
  }
  const recentlyLogs = useMemo(() => {
    let filteredLogs = logs.filter((log) => log.enemy !== '')
    filteredLogs = filteredLogs.sort((a, b) => b.id - a.id)
    filteredLogs = filteredLogs.slice(0, 5)
    return filteredLogs
  }, [logs])

  return (
    <Paper className="enemy-area" withBorder radius="md" p="md" m="xs">
      <Text color="red" ta="center" fz="xl" fw={700}>
        ENEMY
      </Text>
      <TextInput
        placeholder="クエストより細かい単位の作業名を記録できるよ。(任意)"
        m="md"
        value={enemy}
        onChange={handleChangeEnemy}
        disabled={isRunning}
      ></TextInput>
      <Box m="md">
        <Group spacing={0} mb="xs" align="center">
          <Text size="sm">最近倒したエネミー(5件まで)</Text>
          <Tooltip label="過去のエネミーを押すと現在のエネミーに設定されるよ。">
            <ActionIcon size="xs">
              <IconInfoCircle />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Box ml="md">
          {recentlyLogs.length === 0 && (
            <>
              <Text size="sm">まだ倒したエネミーがいません。</Text>
              <Text size="sm">エネミーを設定してクエストをスタートしてみよう。</Text>
            </>
          )}
          <List size="sm" spacing={5}>
            {recentlyLogs.map((log) => (
              <List.Item key={log.id}>
                <UnstyledButton onClick={() => setEnemy(log.enemy)} disabled={isRunning}>
                  {log.enemy}
                </UnstyledButton>
              </List.Item>
            ))}
          </List>
        </Box>
      </Box>
    </Paper>
  )
}

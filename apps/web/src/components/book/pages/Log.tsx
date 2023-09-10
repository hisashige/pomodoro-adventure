import React, { LegacyRef, useEffect, useMemo, useState } from 'react'
import { ActionIcon, Checkbox, Grid, Group, MultiSelect, Text, Tooltip } from '@mantine/core'
import Page from '../layouts/Page'
import { useQuestContext } from '../../../contexts/QuestContext'
import LogList from '../parts/log/LogList'
import { Log, useLogContext } from '../../../contexts/LogContext'
import { IconInfoCircle } from '@tabler/icons-react'

interface Props {
  number: number
}
export default React.forwardRef(({ number }: Props, ref: LegacyRef<HTMLDivElement>) => {
  const { questList } = useQuestContext()
  const { logs } = useLogContext()
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([])
  const [selectValues, setSelectValues] = useState<string[]>([])
  const [dispDeletedQuest, setDispDeletedQuest] = useState(false)

  const questSelects = useMemo(() => {
    let selects = structuredClone(questList)
    if (!dispDeletedQuest) {
      selects = selects.filter((item) => !item.delete)
    }
    // プルダウンの差し替え
    const ids = selects.map((item) => item.id)
    setSelectValues(selectValues.filter((value) => ids.includes(Number(value))))

    return selects.map((item) => {
      return { value: item.id.toString(), label: item.name }
    })
  }, [questList, dispDeletedQuest])

  useEffect(() => {
    let filteredLogs = logs.filter((log) => selectValues.includes(log.questId.toString()))
    filteredLogs = filteredLogs.sort((a, b) => b.id - a.id)
    setFilteredLogs(filteredLogs)
  }, [selectValues, dispDeletedQuest])

  const handleSelectsChange = (values: string[]) => {
    setSelectValues(values)
  }
  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDispDeletedQuest(event.target.checked)
  }

  return (
    <div className="page" ref={ref}>
      <Page number={number} header="Log">
        <Grid grow gutter="sm" align="end">
          <Grid.Col span={10}>
            <MultiSelect
              data={questSelects}
              value={selectValues}
              label="QUEST"
              placeholder="ログを見たいクエストを選んでね。"
              searchable
              mx="xs"
              onChange={handleSelectsChange}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Checkbox
              styles={{ body: { justifyContent: 'center' } }}
              onChange={handleCheckChange}
              label={
                <Group spacing={0} mb="xs">
                  <Text>削除済</Text>
                  <Tooltip label="削除したクエストも表示します。">
                    <ActionIcon size="xs">
                      <IconInfoCircle />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              }
            />
          </Grid.Col>
        </Grid>
        <LogList filteredLogs={filteredLogs} />
      </Page>
    </div>
  )
})

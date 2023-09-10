import { Checkbox, Grid, Group, Paper, TextInput, Text, ActionIcon } from '@mantine/core'
import React, { useMemo, useState } from 'react'
import { Quest, useQuestContext } from '../../../../contexts/QuestContext'
import { IconBackspace } from '@tabler/icons-react'
import { usePomodoroContext } from '../../../../contexts/PomodoroContext'
import { level } from '../../../../libs/dataUtils'

interface Props {
  storedQuest: Quest | undefined
  editQuest: Quest
  onChangeName: (questId: number, newName: string) => void
  onDelete: (questId: number) => void
  isEdit: boolean
}

const QuestItem: React.FC<Props> = ({ storedQuest, editQuest, onChangeName, onDelete, isEdit }) => {
  const { isRunning } = usePomodoroContext()
  const { selectedQuestId, setSelectedQuestId } = useQuestContext()
  const [name, setName] = useState(editQuest.name)

  const isEmpty = editQuest.name === ''

  const selectQuest = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEmpty && event.target.checked) {
      setSelectedQuestId(editQuest.id)
    }
  }

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    onChangeName(editQuest.id, e.target.value)
  }

  const handleDelete = () => {
    onDelete(editQuest.id)
  }

  const levelLabel = useMemo(() => {
    const label = storedQuest ? level(storedQuest) : 'NaN'
    return `Level:${label}`
  }, [storedQuest])

  return (
    <Paper withBorder radius="md" p="xs" m="xs">
      <Grid grow gutter="sm" align="center">
        {isEdit ? (
          <>
            <Grid.Col span={10}>
              <TextInput
                placeholder="クエスト名"
                value={editQuest.name}
                onChange={handleChangeName}
                maxLength={30}
              />
            </Grid.Col>
            <Grid.Col span={1}>
              <Group>
                <ActionIcon
                  color="red"
                  size="xl"
                  radius="md"
                  variant="light"
                  onClick={handleDelete}
                >
                  <IconBackspace />
                </ActionIcon>
                {storedQuest && storedQuest.name === name}
              </Group>
            </Grid.Col>
          </>
        ) : (
          <>
            <Grid.Col span={1}>
              <Checkbox
                styles={{ body: { justifyContent: 'center' } }}
                onChange={selectQuest}
                checked={!isEmpty && editQuest.id === selectedQuestId}
                disabled={isRunning}
              />
            </Grid.Col>
            <Grid.Col span={9}>
              <Text>{editQuest.name}</Text>
            </Grid.Col>
            <Grid.Col span={2}>
              <Text fw={500} fs="italic">
                {levelLabel}
              </Text>
            </Grid.Col>
          </>
        )}
      </Grid>
    </Paper>
  )
}

export default QuestItem

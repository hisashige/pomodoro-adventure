import React, { LegacyRef, useEffect, useMemo, useState } from 'react'
import QuestItem from '../parts/questList/QuestItem'
import { Quest, useQuestContext } from '../../../contexts/QuestContext'
import Page from '../layouts/Page'
import { ActionIcon, Button, Center, Group, Loader, Text } from '@mantine/core'
import { Alert } from '@mantine/core'
import {
  IconCheck,
  IconDeviceFloppy,
  IconEdit,
  IconPlus,
  IconX,
  IconInfoCircle,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { usePomodoroContext } from '../../../contexts/PomodoroContext'
import Enemy from '../parts/questList/Enemy'
import { createId } from '../../../libs/dataUtils'
import { throttle } from '../../../libs/throttle'

interface Props {
  number: number
}

export default React.forwardRef(({ number }: Props, ref: LegacyRef<HTMLDivElement>) => {
  const { isRunning } = usePomodoroContext()
  const {
    questList,
    initialQueryCompleted,
    mutationQuestList,
    queryLoading,
    mutationLoading,
    queryError,
    isEdit,
    setIsEdit,
  } = useQuestContext()
  const [editQuestList, setEditQuestList] = useState([] as Quest[])
  const aliveEditQuestList = useMemo(
    () => editQuestList.filter((item) => !item.delete),
    [editQuestList]
  )

  useEffect(() => {
    if (!initialQueryCompleted) return
    setEditQuestList(questList)
    if (questList.length < 1) {
      setIsEdit(true)
      handleAddQuest()
    }
  }, [initialQueryCompleted])

  const handleNameChange = (questId: number, newName: string) => {
    const updatedQuestList = editQuestList.map((item) =>
      item.id === questId ? { ...item, name: newName } : item
    )
    setEditQuestList(updatedQuestList)
  }

  const handleDelete = (questId: number) => {
    let updatedQuestList: Quest[] = []
    if (questList.some((quest) => quest.id === questId)) {
      // 既存のクエストの場合は削除フラグを立てる
      // 名前を消して削除されようとした場合、名前を復活させる
      const oldQuest = editQuestList.find((quest) => quest.id === questId)
      const oldQuestName = oldQuest?.name || ''
      updatedQuestList = editQuestList.map((item) =>
        item.id === questId ? { ...item, name: oldQuestName, delete: true } : item
      )
    } else {
      // 今追加したばかりのものであれば完全に削除
      updatedQuestList = editQuestList.filter((quest) => quest.id !== questId)
    }
    if (updatedQuestList) setEditQuestList(updatedQuestList)
  }

  const handleAddQuest = () => {
    const newQuestId = createId(editQuestList)
    const newQuest: Quest = { id: newQuestId, name: '', totalMinutes: 0, delete: false }
    setEditQuestList([...editQuestList, newQuest])
  }

  const handleSaveAll = throttle(async () => {
    const validateErrors = editQuestList.filter((item) => item.name === '' || item.name.length > 30)
    if (validateErrors.length > 0) {
      notifications.show({
        title: <Text weight="bold">保存に失敗しました。</Text>,
        message: `クエスト名は1~30文字以内で入力してください。`,
        color: 'red',
        icon: <IconX size="1.2rem" />,
      })
      return
    }
    if (editQuestList.length < 1) {
      notifications.show({
        title: <Text weight="bold">保存に失敗しました。</Text>,
        message: `クエストは１件以上登録してください。`,
        color: 'red',
        icon: <IconX size="1.2rem" />,
      })
      return
    }
    const success = await mutationQuestList(editQuestList)
    if (success) {
      notifications.show({
        title: <Text weight="bold">保存</Text>,
        message: `クエストの設定を保存しました。`,
        color: 'teal',
        icon: <IconCheck size="1.2rem" />,
      })
      setIsEdit(false)
    }
  })

  const cancelEdit = () => {
    setEditQuestList(questList)
    setIsEdit(false)
  }

  const onEditable = () => {
    setIsEdit(true)
    if (questList.length === 0) {
      handleAddQuest()
    }
  }

  const ButtonArea = () => {
    if (isRunning) return
    if (isEdit) {
      return (
        <Group position="center">
          <Button radius="lg" onClick={handleSaveAll}>
            <IconDeviceFloppy />
            保存
          </Button>
          <Button radius="lg" variant="outline" onClick={cancelEdit}>
            キャンセル
          </Button>
        </Group>
      )
    } else {
      return (
        <Group position="right">
          <Button radius="lg" variant="outline" onClick={onEditable}>
            <IconEdit />
            編集
          </Button>
        </Group>
      )
    }
  }

  return (
    <div className="page" ref={ref}>
      <Page number={number} header="Quest List">
        <div className="quest-area">
          {queryError ? (
            <Alert
              variant="light"
              color="orange"
              title="クエストの取得に失敗しました。"
              icon={<IconInfoCircle />}
            >
              通信状態などを確認してください。
              <br />
              {queryError.message}
            </Alert>
          ) : (
            <>
              {queryLoading || mutationLoading ? (
                <Center m={30}>
                  <Loader size={50} />
                </Center>
              ) : (
                <>
                  <ButtonArea />
                  {aliveEditQuestList.map((quest) => {
                    const storedQuest = questList.find((fixQuest) => fixQuest.id === quest.id)
                    return (
                      <QuestItem
                        key={quest.id}
                        storedQuest={storedQuest}
                        editQuest={quest}
                        onChangeName={handleNameChange}
                        onDelete={handleDelete}
                        isEdit={isEdit}
                      />
                    )
                  })}
                </>
              )}
            </>
          )}

          {isEdit && aliveEditQuestList.length < 5 && (
            <Group position="right" pr={30}>
              <ActionIcon variant="filled" radius="lg" onClick={handleAddQuest}>
                <IconPlus />
              </ActionIcon>
            </Group>
          )}
        </div>

        <Enemy isRunning={isRunning}></Enemy>
      </Page>
    </div>
  )
})

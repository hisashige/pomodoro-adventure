import { ActionIcon, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconBackspace } from '@tabler/icons-react'

interface Props {
  questName: string
  disabled?: boolean
  deleteQuest: () => void
}
export function QuestDeleteButton({ questName, disabled, deleteQuest }: Props) {
  const openModal = () =>
    modals.openConfirmModal({
      title: <Text weight="bold">{`クエスト「${questName}」を本当に削除しますか？`}</Text>,
      centered: true,
      children: (
        <Text size="sm">
          ・クエストを削除すると、これまでのデータは全て削除されます。
          <br />
          ・別の編集中のデータがある場合、保存されていないデータは失われます。保存してから実行してください。
        </Text>
      ),
      labels: { confirm: '削除', cancel: 'キャンセル' },
      confirmProps: { color: 'red' },
      onConfirm: deleteQuest,
    })

  return (
    <ActionIcon
      color="red"
      size="xl"
      radius="md"
      variant="light"
      onClick={openModal}
      disabled={disabled}
    >
      <IconBackspace />
    </ActionIcon>
  )
}

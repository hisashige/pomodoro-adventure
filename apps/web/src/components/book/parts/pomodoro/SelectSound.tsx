import { forwardRef } from 'react'
import { Group, Avatar, Text, Select } from '@mantine/core'
import { SOUNDS } from '../../../../consts/pomodoro'

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string
  label: string
  description: string
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
)

interface Props {
  setSound: React.Dispatch<React.SetStateAction<string>>
}
export default function SelectSound({ setSound }: Props) {
  return (
    <Select
      label="Choose BGM"
      itemComponent={SelectItem}
      data={SOUNDS}
      maxDropdownHeight={400}
      filter={(value, item) =>
        item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
        item.description.toLowerCase().includes(value.toLowerCase().trim())
      }
      defaultValue={SOUNDS[0].value}
      onChange={(value) => setSound(value ?? SOUNDS[0].value)}
    />
  )
}

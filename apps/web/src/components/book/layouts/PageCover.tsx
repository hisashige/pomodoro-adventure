import { Flex } from '@mantine/core'
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}
const PageCover: React.FC<Props> = ({ children }: Props) => {
  return (
    <Flex
      gap="md"
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
      style={{ height: '100%' }}
    >
      {children}
    </Flex>
  )
}

export default PageCover

import React, { LegacyRef } from 'react'
import { Button, Text } from '@mantine/core'
import PageCover from '../layouts/PageCover'

type Props = {
  toNextPage: () => void
}
export default React.forwardRef(({ toNextPage }: Props, ref: LegacyRef<HTMLDivElement>) => {
  return (
    <div ref={ref} className={'page page-cover page-cover-top'}>
      <PageCover>
        <Text size={40} align="center" style={{ fontFamily: 'Inknut Antiqua' }}>
          This is your adventure
        </Text>
        <Button
          onClick={toNextPage}
          radius="xl"
          size="lg"
          style={{ width: '200px' }}
          className="init-button"
        >
          Press to Start
        </Button>
      </PageCover>
    </div>
  )
})

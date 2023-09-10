import React, { LegacyRef } from 'react'
import { Text } from '@mantine/core'
import PageCover from '../layouts/PageCover'

type Props = {
  toPrevPage: () => void
}
export default React.forwardRef(({}: Props, ref: LegacyRef<HTMLDivElement>) => {
  return (
    <div ref={ref} className={'page page-cover page-cover-bottom'}>
      <PageCover>
        <Text size={20} weight="bold">
          © 2023 Hisashige Takahashi. All Rights Reserved.
        </Text>
      </PageCover>
    </div>
  )
})

import React, { LegacyRef, useEffect, useState } from 'react'
import { Image } from '@mantine/core'
import Page from '../layouts/Page'
import Timer from '../parts/pomodoro/Timer'
import { TimerStatus, usePomodoroContext } from '../../../contexts/PomodoroContext'
import { FINISHED_IMGS, PAUSED_IMGS, PLAYING_IMGS, WAITING_IMGS } from '../../../consts/images'

interface ImageUrls {
  [TimerStatus.Playing]: string
  [TimerStatus.Paused]: string
  [TimerStatus.Finished]: string
}

interface Props {
  number: number
}
export default React.forwardRef(({ number }: Props, ref: LegacyRef<HTMLDivElement>) => {
  const { status } = usePomodoroContext()
  const [imageUrls, setImageUrls] = useState<ImageUrls>()
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    // WaitingがFinishedになれば、初期状態もしくは一周したとして画像セットを交換する
    if (status === TimerStatus.Waiting || status === TimerStatus.Finished) {
      const playingIndex = Math.floor(Math.random() * PLAYING_IMGS.length)
      const pausedIndex = Math.floor(Math.random() * PAUSED_IMGS.length)
      const finishedIndex = Math.floor(Math.random() * FINISHED_IMGS.length)
      setImageUrls({
        [TimerStatus.Playing]: PLAYING_IMGS[playingIndex],
        [TimerStatus.Paused]: PAUSED_IMGS[pausedIndex],
        [TimerStatus.Finished]: FINISHED_IMGS[finishedIndex],
      })
    }
    if (status === TimerStatus.Waiting) {
      // Waiting画像は先に設定する
      const waitingIndex = Math.floor(Math.random() * WAITING_IMGS.length)
      setImageUrl(WAITING_IMGS[waitingIndex])
    } else if (status !== TimerStatus.CountStart && status !== TimerStatus.FadeOut) {
      // 状態が変われば表示画像を切り替える
      if (imageUrls) {
        const url = imageUrls[status]
        setImageUrl(url)
      }
    }
  }, [status])

  return (
    <div className="page" ref={ref}>
      <Page number={number} header="Pomodoro   Field">
        <Image className="image-area" radius={5} height={400} src={imageUrl}></Image>
        <div className="page-text timer-area">
          <Timer></Timer>
        </div>
      </Page>
    </div>
  )
})

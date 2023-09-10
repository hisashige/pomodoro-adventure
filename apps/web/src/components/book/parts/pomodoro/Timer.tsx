import { useEffect, useState } from 'react'
import { Text, Paper, Container, Button, Center } from '@mantine/core'
import { useTimer } from 'react-timer-hook'
import Player from './Player'
import { POMODORO_TIME } from '../../../../consts/pomodoro'
import { useQuestContext } from '../../../../contexts/QuestContext'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconX } from '@tabler/icons-react'
import { TimerStatus, usePomodoroContext } from '../../../../contexts/PomodoroContext'
import { getHowl } from '../../../../libs/howler'
import { useLogContext } from '../../../../contexts/LogContext'
import coundDown from '../../../../assets/sounds/countdown.mp3'

export default function Timer() {
  const { questList, setQuestList, selectedQuestId, isEdit } = useQuestContext()
  const { status, setStatus, volume } = usePomodoroContext()
  const { createLog, doneLog } = useLogContext()
  const [countNum, setCountNum] = useState(3)

  // カウントダウン音
  const [howl] = useState(getHowl(coundDown, volume))
  useEffect(() => {
    if (status === TimerStatus.CountStart || status === TimerStatus.FadeOut) {
      howl.play()
    } else {
      howl.stop()
    }
  }, [status])
  // ボリューム設定
  useEffect(() => {
    howl.volume(volume / 100)
  }, [volume])

  /**********************
   * タイマー処理
   **********************/
  // タイマーの時間
  const initianExpiryTimestamp = new Date()
  initianExpiryTimestamp.setSeconds(initianExpiryTimestamp.getSeconds() + POMODORO_TIME)
  // タイマー終了時の処理
  const onTimerExpire = () => {
    setStatus(TimerStatus.Finished)
    const targetIndex = questList.findIndex((item) => item.id === selectedQuestId)
    if (targetIndex !== -1) {
      const updatedQuestList = structuredClone(questList)
      updatedQuestList[targetIndex].totalMinutes =
        updatedQuestList[targetIndex].totalMinutes + Math.round(POMODORO_TIME / 60)
      setQuestList(updatedQuestList)
      doneLog()
    } else {
      notifications.show({
        title: <Text weight="bold">達成データの作成に失敗しました。</Text>,
        message: `選択されているクエストが見つからなかったため、達成データを追加できませんでした。`,
        color: 'red',
        icon: <IconX size="1.2rem" />,
      })
    }
  }
  // タイマー設定
  const { seconds, minutes, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp: initianExpiryTimestamp,
    onExpire: onTimerExpire,
    autoStart: false,
  })
  // タイマーの状態管理
  useEffect(() => {
    if (isRunning) {
      setStatus(TimerStatus.Playing)
    }
  }, [isRunning])
  // フェードアウト処理
  useEffect(() => {
    if (minutes === 0 && seconds === 3) {
      setStatus(TimerStatus.FadeOut)
      startCount(TimerStatus.FadeOut)
    }
  }, [seconds])
  // スタート処理
  const startTimer = () => {
    if (isEdit) {
      modals.open({
        title: 'クエストの編集中は開始できません。',
        children: (
          <>
            <Button fullWidth onClick={() => modals.closeAll()} mt="md">
              閉じる
            </Button>
          </>
        ),
      })
      return
    }
    if (selectedQuestId === null) {
      modals.open({
        title: 'クエストを選択して開始してください。',
        children: (
          <>
            <Button fullWidth onClick={() => modals.closeAll()} mt="md">
              閉じる
            </Button>
          </>
        ),
      })
      return
    }
    startCount(TimerStatus.CountStart, start)
    createLog()
  }
  // 再スタート処理
  const restartTimer = () => {
    const restartExpiryTimestamp = new Date()
    restartExpiryTimestamp.setSeconds(restartExpiryTimestamp.getSeconds() + POMODORO_TIME + 3)
    startCount(TimerStatus.CountStart, () => restart(restartExpiryTimestamp))
    createLog()
  }
  // カウント処理（スタート、フェードアウト時共通）
  const startCount = (status: TimerStatus, callback?: () => void) => {
    setStatus(status)
    const countInterval = setInterval(() => {
      setCountNum((prev) => prev - 1)
    }, 1000)
    setTimeout(() => {
      if (callback) callback()
      if (status === TimerStatus.CountStart) {
        setStatus(TimerStatus.Playing)
      }
      clearInterval(countInterval)
      setCountNum(3)
    }, 3000)
  }

  /**********************
   * 表示制御
   **********************/
  function ButtonArea() {
    let buttonArea
    switch (status) {
      case TimerStatus.Playing:
        buttonArea = (
          <Button
            onClick={() => {
              setStatus(TimerStatus.Paused)
              pause()
            }}
            variant="gradient"
            gradient={{ from: 'teal', to: 'lime', deg: 105 }}
          >
            STOP
          </Button>
        )
        break
      case TimerStatus.Paused:
        buttonArea = (
          <Button
            onClick={() => {
              setStatus(TimerStatus.Playing)
              resume()
            }}
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan' }}
          >
            RESUME
          </Button>
        )
        break
      case TimerStatus.Finished:
        buttonArea = (
          <Button
            onClick={restartTimer}
            variant="gradient"
            gradient={{ from: 'orange', to: 'red' }}
          >
            RE-START
          </Button>
        )
        break
      case TimerStatus.CountStart:
      case TimerStatus.FadeOut:
        buttonArea = (
          <Button variant="gradient" disabled>
            カウントダウン中
          </Button>
        )
        break
      default:
        buttonArea = (
          <Button
            onClick={startTimer}
            variant="gradient"
            gradient={{ from: 'teal', to: 'blue', deg: 60 }}
          >
            START
          </Button>
        )
        break
    }
    return buttonArea
  }

  const subMessage = () => {
    let message
    switch (status) {
      case TimerStatus.Playing:
        message = 'クエスト中'
        break
      case TimerStatus.Paused:
        message = '一時停止中...'
        break
      case TimerStatus.Finished:
        message = 'お疲れ様でした。次も頑張ろう！'
        break
      case TimerStatus.CountStart:
        message = 'Are you ready?'
        break
      case TimerStatus.FadeOut:
        message = 'もう少し…！'
        break
      default:
        message = '待機中'
        break
    }
    return message
  }

  const padingZero = (num: number) => ('00' + num).slice(-2)

  return (
    <>
      <Paper withBorder radius="md" p="xs" m="xs">
        <Player></Player>
      </Paper>
      <Paper withBorder radius="md" p="xs" m="xs">
        <Center>
          <Text color="dimmed" size="xl" transform="uppercase" weight={700}>
            {subMessage()}
          </Text>
        </Center>
        <Center>
          <Container size={500}>
            <Text weight={400} size={100}>
              {status === TimerStatus.CountStart ? (
                countNum
              ) : (
                <>
                  <span>{padingZero(minutes)}</span>:<span>{padingZero(seconds)}</span>
                </>
              )}
            </Text>
          </Container>
        </Center>
        <Center>
          <ButtonArea />
        </Center>
      </Paper>
    </>
  )
}

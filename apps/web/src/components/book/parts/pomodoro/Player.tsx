import { useEffect, useState } from 'react'
import { Center, Grid, Slider, Text } from '@mantine/core'
import { IconGripHorizontal } from '@tabler/icons-react'
import SelectSound from './SelectSound'
import { SOUNDS } from '../../../../consts/pomodoro'
import { TimerStatus, usePomodoroContext } from '../../../../contexts/PomodoroContext'
import { getHowl } from '../../../../libs/howler'

const Player = () => {
  const { status } = usePomodoroContext()
  const { volume, setVolume } = usePomodoroContext()
  const [sound, setSound] = useState(SOUNDS[0].value)
  const [howl, setHowl] = useState(getHowl(sound, volume))
  useEffect(() => {
    switch (status) {
      case TimerStatus.Playing:
        howl.volume(volume / 100)
        howl.play()
        break
      case TimerStatus.Paused:
        howl.pause()
        break
      case TimerStatus.Finished:
        howl.stop()
        break
      case TimerStatus.FadeOut:
        howl.fade(volume / 100, 0, 3000)
        break
      default:
        break
    }
  }, [status])
  useEffect(() => {
    if (TimerStatus.Playing) howl.stop()
    howl.unload()
    setHowl(getHowl(sound, volume))
  }, [sound])
  useEffect(() => {
    if (status === TimerStatus.Playing) howl.play()
  }, [howl])
  useEffect(() => {
    howl.volume(volume / 100)
  }, [volume])

  const handleChange = (value: number) => {
    setVolume(value)
  }

  return (
    <Grid>
      <Grid.Col span={4}>
        <Center style={{ height: '100%' }}>
          <Text color="dimmed" size="xl" transform="uppercase" weight={700}>
            BGM
          </Text>
        </Center>
      </Grid.Col>
      <Grid.Col span={4}>
        <SelectSound setSound={setSound}></SelectSound>
      </Grid.Col>
      <Grid.Col span={4}>
        <Text size="sm" weight="450">
          volume
        </Text>
        <Slider
          thumbChildren={<IconGripHorizontal size="1.2rem" stroke={1.5} />}
          value={volume}
          onChange={handleChange}
          label={volume + '%'}
          size="xs"
        />
      </Grid.Col>
    </Grid>
  )
}
export default Player

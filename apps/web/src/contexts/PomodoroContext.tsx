import { createContext, useContext, ReactNode, useState, useMemo } from 'react'

export enum TimerStatus {
  Waiting = 'waiting',
  Playing = 'playing',
  Paused = 'paused',
  Finished = 'finished',
  CountStart = 'CountStart',
  FadeOut = 'fadeOut',
}

type PomodoroContext = {
  isRunning: boolean
  status: TimerStatus
  setStatus: React.Dispatch<React.SetStateAction<TimerStatus>>
  volume: number
  setVolume: React.Dispatch<React.SetStateAction<number>>
}

const defaultPomodoroContext = {
  isRunning: false,
  status: TimerStatus.Waiting,
  setStatus: () => {},
  volume: 20,
  setVolume: () => {},
}

const PomodoroContext = createContext<PomodoroContext>(defaultPomodoroContext)

interface Props {
  children: ReactNode
}
export const PomodoroProvider = ({ children }: Props) => {
  const [status, setStatus] = useState(defaultPomodoroContext.status)
  const [volume, setVolume] = useState<number>(defaultPomodoroContext.volume)
  const isRunning = useMemo(() => {
    return !(status === TimerStatus.Waiting || status === TimerStatus.Finished)
  }, [status])

  return (
    <PomodoroContext.Provider
      value={{
        isRunning,
        status,
        setStatus,
        volume,
        setVolume,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  )
}

export const usePomodoroContext = () => useContext(PomodoroContext)

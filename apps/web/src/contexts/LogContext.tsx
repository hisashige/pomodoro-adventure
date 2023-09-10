import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useQuestContext } from './QuestContext'
import { now } from '../libs/dateUtils'
import { createId } from '../libs/dataUtils'
import { POMODORO_TIME } from '../consts/pomodoro'

export interface Log {
  id: number
  questId: number
  enemy: string
  done: boolean
  startTime: string
  minutes: number
}
type LogConxtex = {
  enemy: string
  setEnemy: React.Dispatch<React.SetStateAction<string>>
  logs: Log[]
  createLog: () => void
  doneLog: () => void
}

const defaultLogContext: LogConxtex = {
  enemy: '',
  setEnemy: () => {},
  logs: [],
  createLog: () => {},
  doneLog: () => {},
}

const getInitialLogs = () => {
  const logs = localStorage.getItem('logs')
  return logs ? JSON.parse(logs) : defaultLogContext.logs
}

const LogContext = createContext<LogConxtex>(defaultLogContext)

interface Props {
  children: ReactNode
}
export const LogProvider = ({ children }: Props) => {
  const { selectedQuestId } = useQuestContext()
  const [enemy, setEnemy] = useState(defaultLogContext.enemy)
  const [logs, setLogs] = useState<Log[]>(getInitialLogs)
  const [targetLogId, setTargetLogId] = useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem('logs', JSON.stringify(logs))
  }, [logs])

  const createLog = () => {
    if (selectedQuestId) {
      const id = createId(logs)
      setTargetLogId(id)
      const log = {
        id,
        questId: selectedQuestId,
        enemy: enemy,
        done: false,
        startTime: now(),
        minutes: 0,
      }
      const updatedLogs = structuredClone(logs)
      updatedLogs.push(log)
      setLogs(updatedLogs)
    }
  }

  const doneLog = () => {
    const updatedLog = logs.map((item) =>
      item.id === targetLogId
        ? { ...item, done: true, minutes: Math.round(POMODORO_TIME / 60) }
        : item
    )
    setLogs(updatedLog)
    setTargetLogId(null)
  }

  return (
    <LogContext.Provider
      value={{
        enemy,
        setEnemy,
        logs,
        createLog,
        doneLog,
      }}
    >
      {children}
    </LogContext.Provider>
  )
}

export const useLogContext = () => useContext(LogContext)

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useQuestContext } from './QuestContext'
import { now } from '../libs/dateUtils'
import { createId } from '../libs/dataUtils'
import { POMODORO_TIME } from '../consts/pomodoro'
import { useApolloClient } from '../hooks/useApolloClient'
import { useQuery, useMutation, ApolloError } from '@apollo/client'
import { GET_LOGS } from '../gql/query'
import { CREATE_LOG, UPDATE_LOG } from '../gql/mutation'
import { notifications } from '@mantine/notifications'
import { Text } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

export interface Log {
  id: number
  questId: number
  enemy: string
  done: boolean
  startTime: string
  minutes: number
}

type LogConxtex = {
  logs: Log[]
  queryLoading: boolean
  queryError: ApolloError | undefined
  createLoading: boolean
  createError: ApolloError | undefined
  updateLoading: boolean
  updateError: ApolloError | undefined
  enemy: string
  setEnemy: React.Dispatch<React.SetStateAction<string>>
  createLog: () => Promise<boolean>
  doneLog: () => Promise<boolean>
}

const defaultLogContext: LogConxtex = {
  logs: [],
  queryLoading: false,
  queryError: undefined,
  createLoading: false,
  createError: undefined,
  updateLoading: false,
  updateError: undefined,
  enemy: '',
  setEnemy: () => {},
  createLog: () => Promise.resolve(true),
  doneLog: () => Promise.resolve(true),
}

const LogContext = createContext<LogConxtex>(defaultLogContext)

type GetLogResponse = {
  logs: Log[]
}

interface Props {
  children: ReactNode
}
export const LogProvider = ({ children }: Props) => {
  /* ApolloClient */
  const client = useApolloClient()
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery<GetLogResponse>(GET_LOGS, { client })
  const [mutateCreateLog, { loading: createLoading, error: createError }] = useMutation(
    CREATE_LOG,
    {
      client,
      refetchQueries: [{ query: GET_LOGS }],
    }
  )
  const [mutateUpdateLog, { loading: updateLoading, error: updateError }] = useMutation(
    UPDATE_LOG,
    {
      client,
      refetchQueries: [{ query: GET_LOGS }],
    }
  )

  // Apollo Clientのエラーハンドリング
  useEffect(() => {
    if (createError) {
      console.error('createError', createError)

      notifications.show({
        title: <Text weight="bold">クエストの開始に失敗しました。</Text>,
        message: `ログの作成に失敗しました。ネットワーク環境などをご確認ください。`,
        color: 'red',
        icon: <IconX size="1.2rem" />,
      })
    }
  }, [createError])
  useEffect(() => {
    if (updateError) {
      console.error('updateError', updateError)
      notifications.show({
        title: <Text weight="bold">クエストの開始に失敗しました。</Text>,
        message: `ログの更新に失敗しました。ネットワーク環境などをご確認ください。`,
        color: 'red',
        icon: <IconX size="1.2rem" />,
      })
    }
  }, [updateError])

  /* State */
  const { selectedQuestId } = useQuestContext()
  const [enemy, setEnemy] = useState(defaultLogContext.enemy)
  const [logs, setLogs] = useState<Log[]>(defaultLogContext.logs)
  const [targetLogId, setTargetLogId] = useState<number | null>(null)

  /* Effect */
  useEffect(() => {
    if (queryData) {
      setLogs(queryData.logs)
    }
  }, [queryData])

  /* Function */
  const createLog = async () => {
    if (!selectedQuestId) return false

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

    try {
      await mutateCreateLog({ variables: { logData: log } })
      return true
    } catch (error) {
      return false
    }
  }

  const doneLog = async () => {
    const targetLog = logs.find((item) => item.id === targetLogId)
    if (!targetLog) return false

    const updatedLog = {
      ...filterLogKeys(targetLog),
      done: true,
      minutes: Math.round(POMODORO_TIME / 60),
    }
    try {
      await mutateUpdateLog({ variables: { logData: updatedLog } })
      setTargetLogId(null)
      return true
    } catch (error) {
      return false
    }
  }

  return (
    <LogContext.Provider
      value={{
        logs,
        queryLoading,
        queryError,
        createLoading,
        createError,
        updateLoading,
        updateError,
        enemy,
        setEnemy,
        createLog,
        doneLog,
      }}
    >
      {children}
    </LogContext.Provider>
  )
}

export const useLogContext = () => useContext(LogContext)

const filterLogKeys = (log: Log) => {
  return {
    id: log.id,
    questId: log.questId,
    enemy: log.enemy,
    done: log.done,
    startTime: log.startTime,
    minutes: log.minutes,
  }
}

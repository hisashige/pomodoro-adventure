import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react'
import { useApolloClient } from '../hooks/useApolloClient'
import { useQuery, useMutation, ApolloError } from '@apollo/client'
import { GET_QUESTS } from '../gql/query'
import { EDIT_QUESTS } from '../gql/mutation'

export interface Quest {
  id: number
  name: string
  totalMinutes: number
  delete: boolean
}
type QuestContext = {
  questList: Quest[]
  initialQueryCompleted: boolean
  queryLoading: boolean
  queryError: ApolloError | undefined
  mutationLoading: boolean
  mutationError: ApolloError | undefined
  mutationQuestList: (newQuestList: Quest[]) => Promise<boolean>
  selectedQuestId: number | null
  setSelectedQuestId: React.Dispatch<React.SetStateAction<number | null>>
  isEdit: boolean
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
  aliveQuestList: Quest[]
}

const defaultQuestContext = {
  questList: [],
  initialQueryCompleted: false,
  queryLoading: false,
  queryError: undefined,
  mutationLoading: false,
  mutationError: undefined,

  mutationQuestList: () => Promise.resolve(true),
  selectedQuestId: null,
  setSelectedQuestId: () => {},
  isEdit: false,
  setIsEdit: () => {},
  aliveQuestList: [],
}

type GetQuestResponse = {
  quests: Quest[]
}

const QuestContext = createContext<QuestContext>(defaultQuestContext)

interface Props {
  children: ReactNode
}
export const QuestProvider = ({ children }: Props) => {
  /* ApolloClient */
  const client = useApolloClient()
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery<GetQuestResponse>(GET_QUESTS, { client })
  const [editQuests, { loading: mutationLoading, error: mutationError }] = useMutation(
    EDIT_QUESTS,
    {
      client,
      refetchQueries: [{ query: GET_QUESTS }],
    }
  )

  /* State */
  const [initialQueryCompleted, setInitialQueryCompleted] = useState(
    defaultQuestContext.initialQueryCompleted
  )
  const [questList, setQuestList] = useState<Quest[]>(defaultQuestContext.questList)
  const [selectedQuestId, setSelectedQuestId] = useState<number | null>(
    defaultQuestContext.selectedQuestId
  )
  const [isEdit, setIsEdit] = useState(false)
  const aliveQuestList = useMemo(() => questList.filter((item) => !item.delete), [questList])

  /* Effect */
  useEffect(() => {
    if (queryData) {
      console.log('queryData', queryData)
      setQuestList(queryData.quests)
      setInitialQueryCompleted(true)
    }
  }, [queryData])

  /* Function */
  const mutationQuestList = async (newQuestList: Quest[]) => {
    try {
      await editQuests({ variables: { bulkUpdateQuestData: { quests: newQuestList } } })
      setQuestList(newQuestList)
      return true
    } catch (error) {
      return false
    }
  }

  return (
    <QuestContext.Provider
      value={{
        questList,
        initialQueryCompleted,
        queryLoading,
        queryError,
        mutationLoading,
        mutationError,
        mutationQuestList,
        selectedQuestId,
        setSelectedQuestId,
        isEdit,
        setIsEdit,
        aliveQuestList,
      }}
    >
      {children}
    </QuestContext.Provider>
  )
}

export const useQuestContext = () => useContext(QuestContext)

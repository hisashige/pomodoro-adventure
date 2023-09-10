import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react'

export interface Quest {
  id: number
  name: string
  totalMinutes: number
  delete: boolean
}
type QuestContext = {
  questList: Quest[]
  setQuestList: React.Dispatch<React.SetStateAction<Quest[]>>
  selectedQuestId: number | null
  setSelectedQuestId: React.Dispatch<React.SetStateAction<number | null>>
  isEdit: boolean
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
  aliveQuestList: Quest[]
}

const defaultQuestContext = {
  questList: [],
  setQuestList: () => {},
  selectedQuestId: null,
  setSelectedQuestId: () => {},
  isEdit: false,
  setIsEdit: () => {},
  aliveQuestList: [],
}

const getInitialQuestList = () => {
  const questList = localStorage.getItem('questList')
  return questList ? JSON.parse(questList) : defaultQuestContext.questList
}

const QuestContext = createContext<QuestContext>(defaultQuestContext)

interface Props {
  children: ReactNode
}
export const QuestProvider = ({ children }: Props) => {
  const [questList, setQuestList] = useState<Quest[]>(getInitialQuestList)
  const [selectedQuestId, setSelectedQuestId] = useState<number | null>(
    defaultQuestContext.selectedQuestId
  )
  const [isEdit, setIsEdit] = useState(false)
  const aliveQuestList = useMemo(() => questList.filter((item) => !item.delete), [questList])

  useEffect(() => {
    localStorage.setItem('questList', JSON.stringify(questList))
  }, [questList])

  return (
    <QuestContext.Provider
      value={{
        questList,
        setQuestList,
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

import { POMODORO_TIME } from '../consts/pomodoro'
import { Quest } from '../contexts/QuestContext'

interface Item {
  id: number
  [key: string]: any
}
export const createId = (items: Item[]): number => {
  return items.reduce((maxId, item) => (item.id > maxId ? item.id : maxId), 0) + 1
}

export const level = (quest: Quest): number => {
  return Math.round(quest.totalMinutes / (POMODORO_TIME / 60)) + 1
}

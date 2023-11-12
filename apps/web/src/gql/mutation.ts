import { gql } from '@apollo/client'

export const EDIT_QUESTS = gql`
  mutation EditQuests($bulkUpdateQuestData: BulkUpdateQuestInput!) {
    editQuests(bulkUpdateQuestData: $bulkUpdateQuestData) {
      id
      uid
      name
      totalMinutes
      delete
      createdAt
      updatedAt
    }
  }
`

export const CREATE_LOGS = gql`
  mutation CreateLog($logData: LogInput!) {
    createLog(logData: $logData) {
      id
      uid
      enemy
      minutes
      questId
      done
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_LOGS = gql`
  mutation UpdateLog($logData: LogInput!) {
    updateLog(logData: $logData) {
      id
      uid
      enemy
      minutes
      questId
      done
      createdAt
      updatedAt
    }
  }
`

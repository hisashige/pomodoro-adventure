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

export const CREATE_LOG = gql`
  mutation CreateLog($logData: LogInput!) {
    createLog(logData: $logData) {
      id
      uid
      questId
      enemy
      done
      startTime
      minutes
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_LOG = gql`
  mutation UpdateLog($logData: LogInput!) {
    updateLog(logData: $logData) {
      id
      uid
      questId
      enemy
      done
      startTime
      minutes
      createdAt
      updatedAt
    }
  }
`

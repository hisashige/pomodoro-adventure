import { gql } from '@apollo/client'

export const GET_QUESTS = gql`
  query GetQuests {
    quests {
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

export const GET_LOGS = gql`
  query getLogs {
    logs {
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

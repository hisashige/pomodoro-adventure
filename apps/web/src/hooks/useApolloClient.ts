import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client'
import { useUserContext } from '../contexts/UserContext'
import { useMemo } from 'react'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'

if (import.meta.env.DEV) {
  // Adds messages only in a dev environment
  loadDevMessages()
  loadErrorMessages()
}

export function useApolloClient() {
  const { token } = useUserContext()

  const httpLink = new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_ENDPOINT as string })

  const authLink = new ApolloLink((operation, forward) => {
    console.log('token', token)
    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    })

    return forward(operation)
  })

  const client = useMemo(() => {
    return new ApolloClient({
      link: from([authLink, httpLink]),
      cache: new InMemoryCache(),
    })
  }, [token])

  return client
}

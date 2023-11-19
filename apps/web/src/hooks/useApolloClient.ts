import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { useUserContext } from '../contexts/UserContext'
import { useMemo } from 'react'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'

if (import.meta.env.DEV) {
  // Adds messages only in a dev environment
  loadDevMessages()
  loadErrorMessages()
}

export function useApolloClient() {
  const { token, refreshToken } = useUserContext()

  const httpLink = new HttpLink({ uri: import.meta.env.VITE_GRAPHQL_ENDPOINT as string })

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    })

    return forward(operation)
  })

  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (
      graphQLErrors &&
      graphQLErrors.some(
        (err) =>
          err.extensions.code === 'UNAUTHENTICATED' || err.message.includes('auth/id-token-expired')
      )
    ) {
      // トークンのリフレッシュと再試行処理
      refreshToken()
        .then((newToken) => {
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          }))
          return forward(operation)
        })
        .catch((error) => {
          console.error('トークンのリフレッシュ中にエラーが発生しました', error)
        })
    }
  })

  const client = useMemo(() => {
    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache(),
    })
  }, [token])

  return client
}

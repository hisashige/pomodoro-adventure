import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from, Observable } from '@apollo/client'
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
    if (!token) {
      return new Observable((observer) => {
        observer.error(new Error('認証トークンがありません'))
      })
    }

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
      return new Observable((observer) => {
        refreshToken()
          .then((newToken) => {
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              },
            }))
            const subscriber = {
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            }
            forward(operation).subscribe(subscriber)
          })
          .catch((error) => {
            console.error('トークンのリフレッシュ中にエラーが発生しました', error)
            observer.error(error)
          })
      })
    }
    return forward(operation)
  })

  const client = useMemo(() => {
    return new ApolloClient({
      link: from([authLink, errorLink, httpLink]),
      cache: new InMemoryCache(),
    })
  }, [token])

  return client
}

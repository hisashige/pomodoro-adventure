import { Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import {
  User,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  GoogleAuthProvider,
  Auth,
} from 'firebase/auth'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

type UserConxtex = {
  user: User | null
  token: string | null
  auth: Auth | null
  provider: GoogleAuthProvider | null
  initialized: boolean
}

const defaultUserContext: UserConxtex = {
  user: null,
  token: null,
  auth: null,
  provider: null,
  initialized: false,
}

const UserContext = createContext<UserConxtex>(defaultUserContext)

interface Props {
  children: ReactNode
}
export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState(defaultUserContext.user)
  const [token, setToken] = useState(defaultUserContext.token)
  const [initialized, setInitialized] = useState(defaultUserContext.initialized)

  const provider = new GoogleAuthProvider()
  const auth = getAuth()
  useEffect(() => {
    // Googleログインからリダイレクトされたときのユーザー取得処理
    getRedirectResult(auth)
      .then((result) => {
        const resultUser = result?.user
        if (resultUser) {
          setUser(resultUser)
          notifications.show({
            title: <Text weight="bold">サインインに成功しました。</Text>,
            message: `おかえりなさい！引き続き冒険を楽しみましょう。`,
            color: 'teal',
            icon: <IconCheck size="1.2rem" />,
          })
        }
      })
      .catch((error) => {
        let errorMessage
        switch (error.code) {
          case 'auth/credential-already-in-use':
            errorMessage = '既に登録済みのアカウントのため、連携できません。'
            break
          default:
            errorMessage = error.message
            break
        }
        notifications.show({
          title: <Text weight="bold">Googleアカウントでのサインインに失敗しました。</Text>,
          message: errorMessage,
          color: 'red',
          icon: <IconX size="1.2rem" />,
        })
        console.error(error.code)
      })

    // ユーザーはfirebaseが永続化してくれており、以下で取得できる。
    // ユーザー情報が欲しい場合は、ここでsetUserしているので、Contextから取得する。
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        // ログアウトされたらnullにする
        setUser(null)
      }
      setInitialized(true)
    })
  }, [])

  useEffect(() => {
    if (user) {
      user.getIdToken().then((idToken) => {
        setToken(idToken)
      })
    } else {
      setToken(null)
    }
  }, [user])

  // useEffect(() => {
  //   console.log('Google IDトークン:', token)
  //   console.log('Googleユーザー2:', user)
  // }, [token])

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        auth,
        provider,
        initialized,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext)

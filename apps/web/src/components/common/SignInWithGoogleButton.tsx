import { ActionIcon, Tooltip } from '@mantine/core'
import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth'
import { useEffect } from 'react'
import { IconLogout } from '@tabler/icons-react'
import { useUserContext } from '../../contexts/UserContext'

export default function SignInWithGoogleButton() {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()
  const { user, setUser, token } = useUserContext()

  const handleSignIn = () => {
    signInWithRedirect(auth, provider)
  }
  const handleSignOut = () => {
    auth.signOut()
  }

  useEffect(() => {
    // Googleログインからリダイレクトされたときのユーザー取得処理
    getRedirectResult(auth)
      .then((result) => {
        const resultUser = result?.user
        if (resultUser) {
          setUser(resultUser)

          const isOnceLoggedIn = localStorage.getItem('isOnceLoggedIn')
          if (!isOnceLoggedIn) {
            // TODO:初めてログインしたら、データのマイグレーションを行う。
            localStorage.setItem('isOnceLoggedIn', JSON.stringify(true))
          }
        }
      })
      .catch((error) => {
        console.error('Googleログインエラー:', error)
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
    })
  }, [])

  useEffect(() => {
    console.log('Google IDトークン:', token)
    console.log('Googleユーザー2:', user)
  }, [token])

  return user ? (
    <Tooltip label="Sign out">
      <ActionIcon size="lg" color="dark" onClick={handleSignOut}>
        <IconLogout size="1.1rem" stroke={1.5} />
      </ActionIcon>
    </Tooltip>
  ) : (
    <Tooltip label="Sign in with Google">
      <ActionIcon size="lg" color="dark" onClick={handleSignIn}>
        <img style={{ height: '1.5rem' }} src="/images/google.svg" alt="Google SignIn" />
      </ActionIcon>
    </Tooltip>
  )
}

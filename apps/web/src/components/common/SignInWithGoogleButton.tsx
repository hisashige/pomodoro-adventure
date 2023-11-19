import { ActionIcon, Button, Tooltip, Text } from '@mantine/core'
import { linkWithRedirect, signInWithRedirect } from 'firebase/auth'
import { useUserContext } from '../../contexts/UserContext'
import { notifications } from '@mantine/notifications'
import { IconX } from '@tabler/icons-react'

interface Props {
  minimal?: boolean
}

export default function SignInWithGoogleButton({ minimal }: Props) {
  const { user, auth, provider } = useUserContext()

  const handleSignIn = () => {
    if (auth === null || provider === null) return
    if (minimal) {
      if (user === null) return
      linkWithRedirect(user, provider).catch((error) => {
        notifications.show({
          title: <Text weight="bold">Googleアカウントとの連携に失敗しました。</Text>,
          message: error.message,
          color: 'red',
          icon: <IconX size="1.2rem" />,
        })
      })
    } else {
      signInWithRedirect(auth, provider).catch((error) => {
        console.error(error)
        notifications.show({
          title: <Text weight="bold">Googleアカウントでのサインインに失敗しました。</Text>,
          message: error.message,
          color: 'red',
          icon: <IconX size="1.2rem" />,
        })
      })
    }
  }

  return (
    <Tooltip
      w={300}
      multiline
      label="Googleアカウントでログインすることで、他のデバイスでもデータを共有できます。"
    >
      {minimal ? (
        <ActionIcon size="lg" color="dark" onClick={handleSignIn}>
          <img style={{ height: '1.5rem' }} src="/images/google.svg" alt="Google SignIn" />
        </ActionIcon>
      ) : (
        <Button
          style={{
            padding: 0,
            border: 'none',
            background: 'none',
            height: 'auto',
          }}
          onClick={handleSignIn}
        >
          <img style={{ width: '200px' }} src="/images/google-signin.svg" alt="Google SignIn" />
        </Button>
      )}
    </Tooltip>
  )
}

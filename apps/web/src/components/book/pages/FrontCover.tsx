import React, { LegacyRef } from 'react'
import { Button, Loader, Text, Tooltip } from '@mantine/core'
import PageCover from '../layouts/PageCover'
import { useUserContext } from '../../../contexts/UserContext'
import SignInWithGoogleButton from '../../common/SignInWithGoogleButton'
import { signInAnonymously } from 'firebase/auth'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'

type Props = {
  toNextPage: () => void
}
export default React.forwardRef(({ toNextPage }: Props, ref: LegacyRef<HTMLDivElement>) => {
  const { user, auth, initialized } = useUserContext()

  const handleSignInAnonymously = () => {
    if (auth === null) return
    signInAnonymously(auth)
      .then(() => {
        notifications.show({
          title: <Text weight="bold">匿名利用を開始しました。</Text>,
          message: `ヘッダーの右上のアイコンからGoogleアカウントとの連携ができるので、ぜひお試しください。`,
          color: 'teal',
          icon: <IconCheck size="1.2rem" />,
        })
      })
      .catch((error) => {
        notifications.show({
          title: <Text weight="bold">匿名ユーザーでのサインインに失敗しました。</Text>,
          message: error.message,
          color: 'red',
          icon: <IconX size="1.2rem" />,
        })
      })
  }

  return (
    <div ref={ref} className={'page page-cover page-cover-top'}>
      <PageCover>
        <Text size={40} align="center" mb={30} style={{ fontFamily: 'Inknut Antiqua' }}>
          This is your adventure
        </Text>
        {initialized ? (
          user ? (
            <Button
              onClick={toNextPage}
              radius="xl"
              size="lg"
              style={{ width: '200px' }}
              className="init-button"
            >
              Press to Start
            </Button>
          ) : (
            <>
              <SignInWithGoogleButton />
              <Tooltip
                w={300}
                multiline
                label="お試し利用したい場合、アカウントなしで利用できます。が、せっかく頑張ったデータがもったいないので、Googleアカウントでのログインをおすすめします。"
              >
                <Button
                  onClick={handleSignInAnonymously}
                  radius="xl"
                  style={{ width: '200px', height: '40px' }}
                >
                  匿名で始める
                </Button>
              </Tooltip>
            </>
          )
        ) : (
          <Loader size={50} />
        )}
      </PageCover>
    </div>
  )
})

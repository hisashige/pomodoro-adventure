import {
  createStyles,
  Header,
  Group,
  ActionIcon,
  Container,
  rem,
  Image,
  Text,
  Button,
  Tooltip,
} from '@mantine/core'
import { IconBrandX, IconHelp } from '@tabler/icons-react'
import useFlipPage from '../../hooks/useFlipPage'
import { TWITTER_ACCOUNT } from '../../consts/common'
import { useTour } from '@reactour/tour'
import { useOs } from '@mantine/hooks'

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: rem(56),

    [theme.fn.smallerThan('sm')]: {
      justifyContent: 'flex-start',
    },
  },

  social: {
    width: rem(260),

    [theme.fn.smallerThan('sm')]: {
      width: 'auto',
      marginLeft: 'auto',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}))

export default function HeaderMiddle() {
  const os = useOs()
  const isSupportedOS = os === 'windows' || os === 'macos'

  const { classes, cx } = useStyles()

  const { page, totalPage, toPage, toNextPage, toPrevPage } = useFlipPage()

  const pageButton = [
    {
      action: toPrevPage,
      label: '前のページへ',
      disabled: page <= 0,
    },
    {
      action: toNextPage,
      label: '次のページへ',
      disabled: page >= totalPage - 1,
    },
  ]

  const items = pageButton.map((item) => (
    <Button
      key={item.label}
      variant="light"
      onClick={(event) => {
        event.preventDefault()
        item.action()
      }}
      disabled={item.disabled}
    >
      {item.label}
    </Button>
  ))

  const { setCurrentStep, setIsOpen } = useTour()
  const startTour = () => {
    setCurrentStep(0)
    setIsOpen(true)
  }

  return (
    <Header height={56}>
      <Container className={classes.inner}>
        {isSupportedOS && (
          <Group className="nav-button" spacing={5}>
            {items}
          </Group>
        )}
        <a
          href=""
          className={cx(classes.link)}
          onClick={(event) => {
            event.preventDefault()
            toPage(0)
          }}
        >
          <Group spacing={5}>
            <Image maw={50} mx="auto" radius="md" src="images/logo.jpg" alt="ポモにゃん" />
            <Text size="xl" weight={500}>
              Pomodoro Adventure
            </Text>
          </Group>
        </a>
        <Group spacing={0} className={classes.social} position="right" noWrap>
          {page === 1 && (
            <Tooltip label="ツアーを開始する">
              <a onClick={startTour} target="_blank" rel="noopener noreferrer">
                <ActionIcon size="lg" color="dark">
                  <IconHelp size="1.1rem" stroke={1.5} />
                </ActionIcon>
              </a>
            </Tooltip>
          )}

          <Tooltip label="ご要望などはこちら">
            <a href={TWITTER_ACCOUNT} target="_blank" rel="noopener noreferrer">
              <ActionIcon size="lg" color="dark">
                <IconBrandX size="1.1rem" stroke={1.5} />
              </ActionIcon>
            </a>
          </Tooltip>
        </Group>
      </Container>
    </Header>
  )
}

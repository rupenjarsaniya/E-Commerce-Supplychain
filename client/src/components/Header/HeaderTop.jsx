import { useContext, useState } from 'react';
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Avatar,
  Menu,
  Transition,
  rem,
  Text,
  UnstyledButton,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout,
  IconHeart,
  IconStar,
  IconChevronDown,
} from '@tabler/icons-react';
import Link from 'next/link';
import { SupplyContext } from '@/contexts/SupplyContext';
import { formatAddress } from '@/utils/formatAddress';
import Image from 'next/image';
import logo from '@/asserts/logo.png';

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    margin: 0,
    maxWidth: 'unset',
  },

  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color,
    },
  },

  title: {
    color:
      theme.colorScheme === 'light'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
}));

export const links = [
  {
    link: '/',
    label: 'Home',
  },
  {
    link: '/profile',
    label: 'Profile',
  },
];

export const HeaderTop = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, theme, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { appStatus, connectWallet, connectedAccount } =
    useContext(SupplyContext);

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={() => {
        setActive(link.link);
        close();
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <Header height={HEADER_HEIGHT} className={classes.root}>
      <Container className={classes.header}>
        <Title order={4} className={classes.title}>
          <Link href="/">
            <Image src={logo} alt="logo" width={150} />
          </Link>
        </Title>
        <Group spacing={5} className={classes.links}>
          {items}
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group spacing={7}>
                  <Avatar
                    src={'https://randomuser.me/api/portraits/men/1.jpg'}
                    alt={'user.name'}
                    radius="xl"
                    size={20}
                  />
                  {appStatus === 'connected' || appStatus === 'register' ? (
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {formatAddress(connectedAccount, 7)}
                    </Text>
                  ) : (
                    <Text
                      weight={500}
                      size="sm"
                      sx={{ lineHeight: 1 }}
                      mr={3}
                      onClick={connectWallet}
                    >
                      Connect Wallet
                    </Text>
                  )}
                  {(appStatus === 'connected' || appStatus === 'register') && (
                    <IconChevronDown size={rem(12)} stroke={1.5} />
                  )}
                </Group>
              </UnstyledButton>
            </Menu.Target>
            {(appStatus === 'connected' || appStatus === 'register') && (
              <Menu.Dropdown>
                <Menu.Item
                  icon={
                    <IconHeart
                      size="0.9rem"
                      color={theme.colors.red[6]}
                      stroke={1.5}
                    />
                  }
                >
                  {formatAddress(connectedAccount, 20)}
                </Menu.Item>
                <Link href="/profile">
                  <Menu.Item
                    icon={
                      <IconStar
                        size="0.9rem"
                        color={theme.colors.yellow[6]}
                        stroke={1.5}
                      />
                    }
                  >
                    Profile
                  </Menu.Item>
                </Link>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  color="red"
                  icon={<IconLogout size="0.9rem" stroke={1.5} />}
                >
                  Disconnect
                </Menu.Item>
              </Menu.Dropdown>
            )}
          </Menu>
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />

        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
};

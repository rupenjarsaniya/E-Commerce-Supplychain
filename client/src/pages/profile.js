import { SupplyContext } from '@/contexts/SupplyContext';
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Select,
  TextInput,
  createStyles,
} from '@mantine/core';
import { IconEdit, IconUpload } from '@tabler/icons-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
const useStyles = createStyles((theme) => ({
  main: {
    maxWidth: 1000,
    margin: 'auto',
    minHeight: `calc(100vh - 118px)`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  wrap: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: theme.spacing.md,
    gap: 50,
    [theme.fn.smallerThan('xs')]: {
      marginInline: 0,
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  avatarWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapper: {
    cursor: 'pointer',
  },
}));

export default function Profile() {
  const { classes } = useStyles();
  const {
    appStatus,
    name,
    location,
    role,
    setRole,
    setLocation,
    adminContract,
  } = useContext(SupplyContext);
  const router = useRouter();
  const [nameOpened, setNameOpened] = useState(false);
  const [locationOpened, setLocationOpened] = useState(false);
  const [roleOpened, setRoleOpened] = useState(false);

  const assignRole = useCallback(async () => {
    if (!adminContract) {
      return;
    }
    try {
      const response = await adminContract.assignRole(role);

      await response.wait();
    } catch (error) {
      console.log(error);
    }
  }, [role, adminContract]);

  const revokeRole = useCallback(async () => {
    if (!adminContract) {
      return;
    }
    try {
      const response = await adminContract.revokeRole();

      await response.wait();
    } catch (error) {
      console.log(error);
    }
  }, [adminContract]);

  const updateLocation = useCallback(async () => {
    console.log(location, 'location');
    if (!adminContract || !location) {
      return;
    }
    try {
      const response = await adminContract.updateLocation(location);

      await response.wait();
    } catch (error) {
      console.log(error);
    }
  }, [location, adminContract]);

  useEffect(() => {
    if (appStatus !== 'connected') {
      router.push('/');
    }
  }, [router, appStatus]);

  return (
    <>
      <Head>
        <title>E-Commerce Supplychain</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={classes.main}>
        <div className={classes.wrap}>
          <div className={classes.avatarWrapper}>
            <Avatar
              src={'https://randomuser.me/api/portraits/men/4.jpg'}
              alt={'user.name'}
              radius="xl"
              size={200}
            />
          </div>
          <div>
            <TextInput
              label="Name"
              required
              placeholder="Enter You Name"
              onFocus={() => setNameOpened(true)}
              onBlur={() => setNameOpened(false)}
              mt="md"
              sx={{ minWidth: 350 }}
              defaultValue={name}
              // onChange={(event) => setName(event.currentTarget.value)}
              // rightSection={
              //   <ActionIcon variant="transparent">
              //     {true ? <IconEdit size={20} /> : <IconUpload size={20} />}
              //   </ActionIcon>
              // }
            />
            <TextInput
              mt="md"
              label="Location"
              required
              placeholder="Enter Location"
              sx={{ minWidth: 350 }}
              value={location}
              onChange={(event) => setLocation(event.currentTarget.value)}
              rightSection={
                <ActionIcon variant="transparent">
                  {locationOpened ? (
                    <IconUpload
                      size={20}
                      onClick={() => {
                        updateLocation();
                        setLocationOpened(false);
                      }}
                    />
                  ) : (
                    <IconEdit
                      size={20}
                      onClick={() => setLocationOpened(true)}
                    />
                  )}
                </ActionIcon>
              }
            />
            <Select
              mt="md"
              label="Select Your Role"
              required
              placeholder="Select a Role"
              data={[
                { value: 0, label: 'No Role' },
                { value: 1, label: 'Seller' },
                { value: 2, label: 'Transporter' },
                { value: 3, label: 'Customer' },
                { value: 4, label: 'Revoke' },
              ]}
              defaultValue={0}
              onChange={(event) => {
                setRole(event);
              }}
              rightSection={
                <ActionIcon variant="transparent">
                  {roleOpened ? (
                    <IconUpload
                      size={20}
                      onClick={() => {
                        assignRole();
                        setRoleOpened(false);
                      }}
                    />
                  ) : (
                    <IconEdit size={20} onClick={() => setRoleOpened(true)} />
                  )}
                </ActionIcon>
              }
            />
            <Group>
              <Button
                variant="light"
                mt="md"
                color="violet"
                onClick={revokeRole}
              >
                Revoke Role
              </Button>
              <Button variant="light" mt="md" color="red">
                Disconnect
              </Button>
            </Group>
          </div>
        </div>
      </div>
    </>
  );
}

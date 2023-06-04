import Head from 'next/head';
import {
  Button,
  Group,
  Input,
  Select,
  Text,
  TextInput,
  Title,
  createStyles,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { TableRecord } from '@/components/Table';
import { ModalRecord } from '@/components/Modal';
import { useDisclosure } from '@mantine/hooks';
import React, { useCallback, useContext } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '@/asserts/loading.json';
import errorAnimation from '@/asserts/error.json';
import metamaskIcon from '@/asserts/metamask.svg';
import Image from 'next/image';
import Link from 'next/link';
import { SupplyContext } from '@/contexts/SupplyContext';
import { ethers } from 'ethers';
import { client } from '@/helper/sanityClient';

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
    alignSelf: 'flex-end',
    margin: theme.spacing.md,
    [theme.fn.smallerThan('xs')]: {
      marginInline: 0,
    },
  },

  loadingWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: 500,
    height: 500,
  },

  componentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  metmaskLink: {
    color: theme.colors.orange,
  },
}));

export default function Index() {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const {
    appStatus,
    connectWallet,
    newName,
    newLocation,
    newRole,
    openedRegisterModal,
    closeRegisterModal,
    setNewLocation,
    setNewRole,
    setNewName,
    openRegisterModal,
    role,
    orderRow,
    setAppStatus,
    adminContract,
    customerContract,
    fetchUserData,
  } = useContext(SupplyContext);

  const registerUser = useCallback(async () => {
    if (!adminContract) {
      return;
    }
    try {
      if (!newName || !newLocation) {
        alert('All fields are required');
        return;
      }
      const response = await adminContract.registerUser(
        newName,
        newLocation,
        newRole
      );

      await response.wait();
      closeRegisterModal();
      await fetchUserData();
      setAppStatus('connected');
    } catch (error) {
      console.log(error);
    }
  }, [newName, newLocation, adminContract, newRole]);

  const placeOrder = useCallback(async () => {
    if (!customerContract) {
      return;
    }

    try {
      const orderId = 200000;
      const seller_ethAddress = '0x23feD9C71F87E9b6Ba989f92FF090d61E86D9e92';
      const transporter_ethAddress =
        '0xEaB4156CA83B929bE8150Ad10f52E39b1287FD0d';
      const location = 'Kutch';
      const quantity = 1;
      const items = 'Apple Macbook M2 Pro';

      const tx = await customerContract.placeOrder(
        orderId,
        seller_ethAddress,
        transporter_ethAddress,
        location,
        quantity,
        items,
        { value: ethers.utils.parseEther('0.1') }
      );

      const res = await tx.wait();

      const allOrders = await customerContract.getAllOrders();

      const txDoc = {
        _type: 'orderdetail',
        txHash: res.transactionHash,
        customerAddress: res.from,
        sellerAddress: seller_ethAddress,
        transporterAddress: transporter_ethAddress,
        toAddress: allOrders[allOrders.length - 1],
      };

      await client.create(txDoc);
    } catch (error) {
      console.log(error);
    }
  }, [customerContract]);

  const modalContent = (
    <Group>
      <Input.Wrapper label="Item Name" required miw={'100%'} mx="auto">
        <Input placeholder="Item Name" />
      </Input.Wrapper>

      <Group position="apart" grow sx={{ width: '100%' }}>
        <Input.Wrapper label="Quantity" required>
          <Input placeholder="Quantity" />
        </Input.Wrapper>
        <Input.Wrapper label="Amount" required>
          <Input placeholder="Amount" />
        </Input.Wrapper>
      </Group>

      <Input.Wrapper label="Seller Eth Address" miw={'100%'} required mx="auto">
        <Input placeholder="Seller Eth Address" />
      </Input.Wrapper>
      <Input.Wrapper
        label="Transporter Eth Address"
        miw={'100%'}
        required
        mx="auto"
      >
        <Input placeholder="Transporter Eth Address" />
      </Input.Wrapper>
      <Button
        variant={'light'}
        onClick={() => {
          close();
          placeOrder();
        }}
      >
        Place Order
      </Button>
    </Group>
  );

  const registerContent = (
    <Group>
      <TextInput
        label="Name"
        required
        placeholder="Enter You Name"
        sx={{ minWidth: 350 }}
        value={newName}
        onChange={(event) => {
          setNewName(event.currentTarget.value);
        }}
        miw={'100%'}
      />

      <TextInput
        label="Location"
        required
        placeholder="Enter Location"
        sx={{ minWidth: 350 }}
        value={newLocation}
        onChange={(event) => {
          setNewLocation(event.currentTarget.value);
        }}
        miw={'100%'}
      />

      <Select
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
        value={newRole}
        onChange={(event) => {
          setNewRole(event);
        }}
        miw={'100%'}
      />

      <Button variant={'light'} onClick={() => registerUser()}>
        Register
      </Button>
    </Group>
  );

  const connected = (
    <>
      <div className={classes.wrap}>
        {role === 3 && (
          <ModalRecord
            text={'New order'}
            leftIcon={<IconPlus size="1rem" />}
            loading={false}
            variant={'light'}
            content={modalContent}
            title={'Place new order'}
            opened={opened}
            onClose={close}
            onOpen={open}
          />
        )}
      </div>
      <TableRecord data={orderRow} />
    </>
  );

  const register = (
    <div className={classes.wrap}>
      <ModalRecord
        text={'Register'}
        leftIcon={<IconPlus size="1rem" />}
        loading={false}
        variant={'light'}
        content={registerContent}
        title={'Register New User'}
        opened={openedRegisterModal}
        onClose={closeRegisterModal}
        onOpen={openRegisterModal}
      />
    </div>
  );

  const loading = (
    <div className={classes.loadingWrapper}>
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        width={100}
        height={100}
      />
      ;
    </div>
  );

  const notConnected = (
    <div className={classes.componentWrapper}>
      <Button
        leftIcon={<Image src={metamaskIcon} alt="metamask icon" width={40} />}
        size="lg"
        variant="gradient"
        gradient={{ from: 'orange', to: '#d66c04' }}
        onClick={connectWallet}
      >
        Connect Wallet
      </Button>
    </div>
  );

  const error = (
    <div className={classes.loadingWrapper}>
      <Lottie animationData={errorAnimation} loop={true} />;
    </div>
  );

  const noMetaMask = (
    <div className={classes.componentWrapper}>
      <Image src={metamaskIcon} alt="metamask icon" width={100} />
      <Title order={4}>Please Install Metamask</Title>
      <Text fz="xs">
        <Link
          href={'https://metamask.io/download/'}
          target="_blank"
          className={classes.metmaskLink}
        >
          Click here to install
        </Link>
      </Text>
    </div>
  );

  const app = useCallback(
    (appStatus) => {
      switch (appStatus) {
        case 'connected':
          return connected;

        case 'notConnected':
          return notConnected;

        case 'noMetaMask':
          return noMetaMask;

        case 'register':
          return register;

        case 'error':
          return error;

        default:
          return loading;
      }
    },
    [appStatus, connected, notConnected, noMetaMask, register, error, loading]
  );

  return (
    <>
      <Head>
        <title>E-Commerce Supplychain</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={classes.main}>{app(appStatus)}</main>
    </>
  );
}

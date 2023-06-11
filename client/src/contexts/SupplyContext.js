import { getContract } from '@/helper/fetchContracts';
import {
  AdminABI,
  AdminContractAddress,
  CustomerABI,
  CustomerContractAddress,
  OrderABI,
  SellerABI,
  SellerContractAddress,
  TransporterABI,
  TransporterContractAddress,
} from '@/utils/const';
import { useDisclosure } from '@mantine/hooks';
import { ethers } from 'ethers';
import React, { createContext, useCallback, useEffect, useState } from 'react';

export const SupplyContext = createContext();

export const SupplyProvider = ({ children }) => {
  let metamask;
  if (typeof window !== 'undefined') {
    metamask = window.ethereum;
  }

  const [connectedAccount, setConnectedAccount] = useState(
    '0x0000000000000000000000000000000000000000'
  );
  const [appStatus, setAppStatus] = useState('');
  const [adminContract, setAdminContract] = useState(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState(0);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newRole, setNewRole] = useState(0);
  const [customerContract, setCustomerContract] = useState(null);
  const [transporterContract, setTransporterContract] = useState(null);
  const [sellerContract, setSellerContract] = useState(null);
  const [orderRow, setOrderRow] = useState([]);
  const [status, setStatus] = useState([]);

  const [
    openedRegisterModal,
    { open: openRegisterModal, close: closeRegisterModal },
  ] = useDisclosure(false);

  const checkIfWalletIsConnected = useCallback(async () => {
    if (!metamask) {
      setAppStatus('noMetaMask');
      return;
    }

    try {
      setAppStatus('loading');
      const accounts = await metamask.request({ method: 'eth_accounts' });

      if (accounts.length > 0) {
        const provider = new ethers.providers.Web3Provider(metamask);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        setConnectedAccount(signerAddress);
        setAppStatus('connected');
      } else {
        setAppStatus('notConnected');
      }
    } catch (error) {
      if (error.code === 4001) {
        setAppStatus('notConnected');
      } else {
        setAppStatus('error');
      }
      console.log(error);
    }
  }, [metamask]);

  const connectWallet = useCallback(async () => {
    if (!metamask) {
      setAppStatus('noMetaMask');
      return;
    }

    try {
      setAppStatus('loading');
      const accounts = await metamask.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const provider = new ethers.providers.Web3Provider(metamask);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        setConnectedAccount(signerAddress);
        setAppStatus('connected');
      } else {
        setAppStatus('notConnected');
      }
    } catch (error) {
      if (error.code === 4001) {
        setAppStatus('notConnected');
      } else {
        setAppStatus('error');
      }
      console.log(error);
    }
  }, [metamask]);

  const getAdminContract = useCallback(async () => {
    if (!metamask) {
      setAppStatus('noMetaMask');
      return;
    }

    try {
      const contract = await getContract(
        metamask,
        AdminContractAddress,
        AdminABI
      );

      setAdminContract(contract);

      const userData = await contract.getUser();
      if (
        userData.ethAddress === '0x0000000000000000000000000000000000000000'
      ) {
        setAppStatus('register');
        openRegisterModal();
      } else {
        setName(userData.name);
        setLocation(userData.location);
        setRole(userData.role);
      }
    } catch (error) {
      console.log(error);
    }
  }, [metamask]);

  const fetchUserData = useCallback(async () => {
    if (!adminContract) {
      return;
    }
    try {
      const userData = await adminContract.getUser();

      if (userData) {
        setName(userData.name);
        setLocation(userData.location);
        setRole(userData.role);
      }
    } catch (error) {
      console.log(error);
    }
  }, [adminContract]);

  const getCustomerContract = useCallback(async () => {
    if (!metamask) {
      return;
    }

    const contract = await getContract(
      metamask,
      CustomerContractAddress,
      CustomerABI
    );

    const allOrders = await contract.getAllOrders();
    getStatus(allOrders);
    setOrderRow(allOrders);
    setCustomerContract(contract);
  }, [metamask, connectedAccount]);

  const getTransporterContract = useCallback(async () => {
    const contract = await getContract(
      metamask,
      TransporterContractAddress,
      TransporterABI
    );

    const allOrders = await contract.getAllOrders();
    getStatus(allOrders);
    setOrderRow(allOrders);
    setTransporterContract(contract);
  }, [metamask, connectedAccount]);

  const getSellerContract = useCallback(async () => {
    const contract = await getContract(
      metamask,
      SellerContractAddress,
      SellerABI
    );

    const allOrders = await contract.getAllOrders();
    getStatus(allOrders);
    setOrderRow(allOrders);
    setSellerContract(contract);
  }, [metamask, connectedAccount]);

  const getStatus = useCallback(
    async (data) => {
      data.map(async (item) => {
        const orderContract = await getContract(metamask, item, OrderABI);
        const res = await orderContract.status();
        let state = '';

        switch (res) {
          case 0:
            state = 'Placed';
            break;

          case 1:
            state = 'Confirmed';
            break;

          case 2:
            state = 'Packaging';
            break;

          case 3:
            state = 'Shipping';
            break;

          case 4:
            state = 'Out for Delivery';
            break;

          case 5:
            state = 'Delivered';
            break;

          case 6:
            state = 'Cancel';
            break;

          default:
            state = '--';
            break;
        }

        setStatus((prev) => [...prev, state]);
      });
    },
    [metamask]
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  useEffect(() => {
    if (appStatus === 'connected') {
      getAdminContract();
      if (role === 3) {
        getCustomerContract();
      } else if (role === 2) {
        getTransporterContract();
      } else if (role === 1) {
        getSellerContract();
      }
    }
  }, [getAdminContract, getCustomerContract, role, appStatus]);

  const value = {
    appStatus,
    connectWallet,
    connectedAccount,
    adminContract,
    name,
    location,
    role,
    openedRegisterModal,
    openRegisterModal,
    closeRegisterModal,
    newName,
    newLocation,
    newRole,
    setNewName,
    setNewLocation,
    setNewRole,
    setRole,
    setLocation,
    customerContract,
    orderRow,
    transporterContract,
    sellerContract,
    metamask,
    setAppStatus,
    fetchUserData,
    status,
  };
  return (
    <SupplyContext.Provider value={value}>{children}</SupplyContext.Provider>
  );
};

import { AdminABI, AdminContractAddress } from '@/utils/const';
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
  const [ethAddress, setEthAddress] = useState('');
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newRole, setNewRole] = useState(0);
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
      const provider = new ethers.providers.Web3Provider(metamask);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        AdminContractAddress,
        AdminABI,
        signer
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
        setEthAddress(userData.ethAddress);
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
        setEthAddress(userData.ethAddress);
      }
    } catch (error) {
      console.log(error);
    }
  }, [adminContract]);

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
    checkIfWalletIsConnected();
  }, [checkIfWalletIsConnected]);

  useEffect(() => {
    if (appStatus === 'connected') {
      getAdminContract();
    }
  }, [getAdminContract, appStatus]);

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
    registerUser,
    fetchUserData,
    setRole,
    assignRole,
    revokeRole,
    updateLocation,
    setLocation,
  };
  return (
    <SupplyContext.Provider value={value}>{children}</SupplyContext.Provider>
  );
};

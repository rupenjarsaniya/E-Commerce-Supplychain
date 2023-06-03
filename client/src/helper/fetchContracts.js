const { ethers } = require('ethers');

export const getContract = async (metamask, contractAddress, abi) => {
  if (!metamask) {
    setAppStatus('noMetaMask');
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(metamask);

    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);

    return contract;
  } catch (error) {
    console.log(error);
  }
};

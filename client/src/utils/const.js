import adminAbi from '../artifacts/contracts/Admin.sol/Admin.json';
import customerAbi from '../artifacts/contracts/Customer.sol/Customer.json';
import sellerAbi from '../artifacts/contracts/Seller.sol/Seller.json';
import transporterAbi from '../artifacts/contracts/Transporter.sol/Transporter.json';
import orderAbi from '../artifacts/contracts/Order.sol/Order.json';

export const AdminContractAddress =
  '0x5c41a03E1EEc314c01853c2df477983b1e448b26';

export const SellerContractAddress =
  '0xf43f3D9F76eD81451C61124A26EEBCc1ab31Fd1a';

export const TransporterContractAddress =
  '0x926E4C564C22f52c7B73940EE2043dc97c046Ffc';

export const CustomerContractAddress =
  '0x585BaA841F26dF503eC354321C37C601b7E85b42';

export const AdminABI = adminAbi.abi;

export const CustomerABI = customerAbi.abi;

export const SellerABI = sellerAbi.abi;

export const TransporterABI = transporterAbi.abi;

export const OrderABI = orderAbi.abi;

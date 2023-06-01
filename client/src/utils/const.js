import adminAbi from '../artifacts/contracts/Admin.sol/Admin.json';
import customerAbi from '../artifacts/contracts/Customer.sol/Customer.json';
import sellerAbi from '../artifacts/contracts/Seller.sol/Seller.json';
import transporterAbi from '../artifacts/contracts/Transporter.sol/Transporter.json';

export const AdminContractAddress =
  '0x184aba15679858F623F03cebFEd5ec238E5C2b33';

export const SellerContractAddress =
  '0xed73a0b5a1e179cd4e89165e7072e5a605705891';

export const TransporterContractAddress =
  '0x67aa463468f1001ef9a4bad3f87ee957011a4edd';

export const CustomerContractAddress =
  '0xa340a7a499ab66cc85a8b787d29e2667e8b67c47';

export const AdminABI = adminAbi.abi;

export const CustomerABI = customerAbi.abi;

export const SellerABI = sellerAbi.abi;

export const TransporterABI = transporterAbi.abi;

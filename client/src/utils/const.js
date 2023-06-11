import adminAbi from '../artifacts/contracts/Admin.sol/Admin.json';
import customerAbi from '../artifacts/contracts/Customer.sol/Customer.json';
import sellerAbi from '../artifacts/contracts/Seller.sol/Seller.json';
import transporterAbi from '../artifacts/contracts/Transporter.sol/Transporter.json';
import orderAbi from '../artifacts/contracts/Order.sol/Order.json';

export const AdminContractAddress =
  '0xD9ed5bb66Ba4663f59532136B51Ba4e23C3b0758';

export const SellerContractAddress =
  '0x2Fe3F901030Ee53F565E5e729abF1D202F336150';

export const TransporterContractAddress =
  '0x1f4c4EF8909138436375e2dF326F63D602a27E8A';

export const CustomerContractAddress =
  '0x08e5871FA14b8922148414fc58fe5b978C3392bF';

export const AdminABI = adminAbi.abi;

export const CustomerABI = customerAbi.abi;

export const SellerABI = sellerAbi.abi;

export const TransporterABI = transporterAbi.abi;

export const OrderABI = orderAbi.abi;

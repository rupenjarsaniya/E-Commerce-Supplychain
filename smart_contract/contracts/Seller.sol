// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Admin.sol";
import "./Order.sol";

contract Seller {
    Admin private admin;
    Order private order;
    enum UserRole {
        NOROLE,
        SELLER,
        TRANSPORTER,
        CUSTOMER,
        REVOKE
    }

    mapping(address => address[]) public orders;

    constructor(Admin adminAddress) {
        admin = adminAddress;
    }

    modifier onlySeller() {
        require(
            UserRole(admin.getRole(msg.sender)) == UserRole.SELLER,
            "Only seller has access"
        );
        _;
    }

    modifier validOrder(Order orderAddress) {
        require(
            orderAddress.seller_ethAddress() == msg.sender,
            "Invalid seller address for this order"
        );
        _;
    }

    // Set Order
    function setNewOrder(
        address seller_ethAddress,
        address orderAddress
    ) external {
        orders[seller_ethAddress].push(orderAddress);
    }

    // Confirm Order
    function confirmOrder(
        Order orderAddress
    ) external onlySeller validOrder(orderAddress) {
        Order(orderAddress).confirmOrder(msg.sender);
    }

    // Packaging Order
    function packagingOrder(
        Order orderAddress
    ) external onlySeller validOrder(orderAddress) {
        Order(orderAddress).packagingOrder(msg.sender);
    }

    // Get Order By Index
    function getOrderByIndex(uint256 index) external view returns (address) {
        return orders[msg.sender][index];
    }

    // Get All Orders
    function getAllOrders() external view returns (address[] memory) {
        return orders[msg.sender];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Admin.sol";
import "./Order.sol";

contract Transporter {
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

    modifier onlyTransporter() {
        require(
            UserRole(admin.getRole(msg.sender)) == UserRole.TRANSPORTER,
            "Only transporter has access"
        );
        _;
    }

    modifier validTransporter(Order orderAddress) {
        require(
            orderAddress.transporter_ethAddress() == msg.sender,
            "Invalid transporter address for this order"
        );
        _;
    }

    // Set New Order
    function setNewOrder(
        address transporter_ethAddress,
        address orderAddress
    ) external {
        orders[transporter_ethAddress].push(orderAddress);
    }

    // Shipping Order
    function shippingOrder(
        Order orderAddress
    ) external onlyTransporter validTransporter(orderAddress) {
        Order(orderAddress).shippingOrder(msg.sender);
    }

    // Out For Delivery Order
    function outForDeliveryOrder(
        Order orderAddress
    ) external onlyTransporter validTransporter(orderAddress) {
        Order(orderAddress).outForDeliveryOrder(msg.sender);
    }

    // Deliverd Order
    function deliverdOrder(
        Order orderAddress
    ) external onlyTransporter validTransporter(orderAddress) {
        Order(orderAddress).deliverdOrder(msg.sender);
    }

    // Get Order Status
    function getOrderStatus(
        address orderAddress
    ) external view returns (Order.OrderStatus) {
        return Order(orderAddress).status();
    }

    // Get All Order
    function getAllOrders() external view returns (address[] memory) {
        return orders[msg.sender];
    }

    // Get Order By Index
    function getOrderByIndex(uint256 index) external view returns (address) {
        return orders[msg.sender][index];
    }
}

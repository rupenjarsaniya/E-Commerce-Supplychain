// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Admin.sol";
import "./Order.sol";
import "./Seller.sol";
import "./Transporter.sol";

contract Customer {
    enum UserRole {
        NOROLE,
        SELLER,
        TRANSPORTER,
        CUSTOMER,
        REVOKE
    }
    Admin private admin;
    Seller private seller;
    Transporter private transporter;
    mapping(address => address[]) public orders;

    constructor(
        Admin adminAddress,
        Seller sellerAddress,
        Transporter transporterAddress
    ) {
        admin = adminAddress;
        seller = sellerAddress;
        transporter = transporterAddress;
    }

    modifier onlyCustomer() {
        require(
            UserRole(admin.getRole(msg.sender)) == UserRole.CUSTOMER,
            "Only customer has access"
        );
        _;
    }

    // Place Order
    function placeOrder(
        uint256 orderId,
        address seller_ethAddress,
        address transporter_ethAddress,
        string memory location,
        uint8 quantity,
        string memory items
    ) external payable onlyCustomer {
        require(
            UserRole(admin.getRole(seller_ethAddress)) == UserRole.SELLER,
            "Invalid seller address"
        );
        require(
            UserRole(admin.getRole(transporter_ethAddress)) ==
                UserRole.TRANSPORTER,
            "Invalid transporter address"
        );
        require(msg.value > 0, "You have to pay");

        Order newOrder = new Order{value: msg.value}(
            admin,
            orderId,
            msg.sender,
            seller_ethAddress,
            transporter_ethAddress,
            location,
            quantity,
            items,
            msg.value
        );
        orders[msg.sender].push(address(newOrder));
        seller.setNewOrder(seller_ethAddress, address(newOrder));
        transporter.setNewOrder(transporter_ethAddress, address(newOrder));
    }

    // Cancel Order
    function cancelOrder(uint256 index) external onlyCustomer {
        Order(orders[msg.sender][index]).cancelOrder(msg.sender);
    }

    // Get All Order
    function getAllOrders() external view returns (address[] memory) {
        return orders[msg.sender];
    }

    // Get Order By Index
    function getOrderByIndex(uint256 index) external view returns (address) {
        return orders[msg.sender][index];
    }

    // Get Order Status
    function getOrderStatus(
        address orderAddress
    ) external view returns (Order.OrderStatus) {
        return Order(orderAddress).status();
    }

    // Get Order Details
    function getOrderDetail(
        address orderAddress
    )
        external
        view
        returns (
            uint256 _orderId,
            address _seller_ethAddress,
            address _transporter_ethAddress,
            string memory _location,
            string memory _items,
            uint256 _quantity,
            uint256 _amount,
            Order.OrderStatus _status
        )
    {
        return Order(orderAddress).getOrderDetail(msg.sender);
    }
}

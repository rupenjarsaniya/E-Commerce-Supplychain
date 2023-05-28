// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Admin.sol";

contract Order {
    enum UserRole {
        NOROLE,
        SELLER,
        TRANSPORTER,
        CUSTOMER,
        REVOKE
    }
    enum OrderStatus {
        PLACED,
        CONFIRM,
        PACKAGING,
        SHIPPED,
        OUT_FOR_DELIVERY,
        DELIVERED,
        CANCEL
    }
    Admin private admin;
    uint256 public orderId;
    address public customer_ethAddress;
    address public seller_ethAddress;
    address public transporter_ethAddress;
    string public location;
    uint8 public quantity;
    string public items;
    uint public amount;
    OrderStatus public status;

    constructor(
        Admin adminAddress,
        uint256 _orderId,
        address _customer_ethAddress,
        address _seller_ethAddress,
        address _transporter_ethAddress,
        string memory _location,
        uint8 _quantity,
        string memory _items,
        uint _amount
    ) payable {
        admin = adminAddress;
        orderId = _orderId;
        customer_ethAddress = _customer_ethAddress;
        seller_ethAddress = _seller_ethAddress;
        transporter_ethAddress = _transporter_ethAddress;
        location = _location;
        quantity = _quantity;
        items = _items;
        amount = _amount;
        status = OrderStatus.PLACED;
    }

    modifier onlySeller(address ethAddress) {
        require(
            UserRole(admin.getRole(ethAddress)) == UserRole.SELLER,
            "Only seller has access"
        );
        require(
            seller_ethAddress == ethAddress,
            "Invalid seller address for this order"
        );
        _;
    }

    modifier onlyTransporter(address ethAddress) {
        require(
            UserRole(admin.getRole(ethAddress)) == UserRole.TRANSPORTER,
            "Only transporter has access"
        );
        require(
            transporter_ethAddress == ethAddress,
            "Invalid transporter address for this order"
        );
        _;
    }

    modifier onlyCustomer(address ethAddress) {
        require(
            UserRole(admin.getRole(ethAddress)) == UserRole.CUSTOMER,
            "Only customer has access"
        );
        require(
            customer_ethAddress == ethAddress,
            "Invalid customer address for this order"
        );
        _;
    }

    // Confirm Order
    function confirmOrder(address ethAddress) external onlySeller(ethAddress) {
        require(status == OrderStatus.PLACED, "Order is not in placed state");

        status = OrderStatus.CONFIRM;
    }

    // Packaging Order
    function packagingOrder(
        address ethAddress
    ) external onlySeller(ethAddress) {
        require(status == OrderStatus.CONFIRM, "Order is not in confirm state");

        status = OrderStatus.PACKAGING;
    }

    // Shipped Order
    function shippingOrder(
        address ethAddress
    ) external onlyTransporter(ethAddress) {
        require(
            status == OrderStatus.PACKAGING,
            "Order is not in packaging state"
        );

        status = OrderStatus.SHIPPED;
    }

    // Out For Delivery Order
    function outForDeliveryOrder(
        address ethAddress
    ) external onlyTransporter(ethAddress) {
        require(status == OrderStatus.SHIPPED, "Order is not in shipped state");

        status = OrderStatus.OUT_FOR_DELIVERY;
    }

    // Deliverd Order
    function deliverdOrder(
        address ethAddress
    ) external payable onlyTransporter(ethAddress) {
        require(
            status == OrderStatus.OUT_FOR_DELIVERY,
            "Order is not in out for delivery state"
        );

        payable(seller_ethAddress).transfer(amount);
        status = OrderStatus.DELIVERED;
    }

    // Cancel Order
    function cancelOrder(address ethAddress) external onlyCustomer(ethAddress) {
        require(
            status == OrderStatus.PLACED ||
                status == OrderStatus.CONFIRM ||
                status == OrderStatus.PACKAGING ||
                status == OrderStatus.SHIPPED,
            "Order cannot be cancel"
        );

        payable(customer_ethAddress).transfer(amount);
        status = OrderStatus.CANCEL;
    }

    // Get Order Details
    function getOrderDetail(
        address ethAddress
    )
        external
        view
        onlyCustomer(ethAddress)
        returns (
            uint _orderId,
            address _seller_ethAddress,
            address _transporter_ethAddress,
            string memory _location,
            string memory _items,
            uint _quantity,
            uint _amount,
            OrderStatus _status
        )
    {
        return (
            orderId,
            seller_ethAddress,
            transporter_ethAddress,
            location,
            items,
            quantity,
            amount,
            status
        );
    }
}

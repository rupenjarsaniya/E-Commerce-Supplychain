// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Admin {
    enum UserRole {
        NOROLE,
        SELLER,
        TRANSPORTER,
        CUSTOMER,
        REVOKE
    }
    struct UserData {
        address ethAddress;
        string name;
        string location;
        UserRole role;
    }

    mapping(address => UserData) private userDetail;

    event RegisterUser(address indexed ethAddress, string name);
    event ReassignRole(address indexed ethAddress, uint8 role);
    event RevokeRole(address indexed ethAddress, uint8 role);
    event UpdateLocation(address indexed ethAddress, string role);

    modifier isUser() {
        require(
            userDetail[msg.sender].ethAddress == msg.sender,
            "Invalid Address Found"
        );
        _;
    }

    // Register User
    function registerUser(
        string memory name,
        string memory location,
        uint256 role
    ) external {
        require(
            userDetail[msg.sender].ethAddress == address(0),
            "User already exixsting with this eth address"
        );

        userDetail[msg.sender] = UserData(
            msg.sender,
            name,
            location,
            UserRole(role)
        );
        emit RegisterUser(msg.sender, name);
    }

    // Revoke Role
    function revokeRole() external isUser {
        userDetail[msg.sender].role = UserRole.REVOKE;
        emit RevokeRole(msg.sender, uint8(userDetail[msg.sender].role));
    }

    // Reassign Role
    function assignRole(uint8 role) external isUser {
        userDetail[msg.sender].role = UserRole(role);
        emit ReassignRole(msg.sender, uint8(userDetail[msg.sender].role));
    }

    // Change Location
    function updateLocation(string memory location) external isUser {
        userDetail[msg.sender].location = location;
        emit UpdateLocation(msg.sender, userDetail[msg.sender].location);
    }

    // User Data
    function getUser() external view returns (UserData memory) {
        return userDetail[msg.sender];
    }

    // User Role
    function getRole(address ethAddress) external view returns (uint8) {
        return uint8(userDetail[ethAddress].role);
    }
}

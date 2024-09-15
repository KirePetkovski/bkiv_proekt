// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SepoliaETHTransfer {
    address public owner;

    event TransferReceived(address indexed from, uint256 amount);
    event TransferSent(address indexed from, address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // Function to receive ETH
    receive() external payable {
        emit TransferReceived(msg.sender, msg.value);
    }

    // Function to withdraw ETH from the contract to a specified address
    function transferTo(address payable _to, uint256 _amount) external {
        require(msg.sender == owner, "Only the owner can execute this transfer");
        require(address(this).balance >= _amount, "Insufficient contract balance");
        _to.transfer(_amount);
        emit TransferSent(address(this), _to, _amount);
    }

    // Get the balance of the contract
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

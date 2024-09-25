// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SepoliaETHTransfer {
    address public owner;

    event TransferReceived(address indexed from, uint256 amount);
    event TransferSent(address indexed from, address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }
    receive() external payable {
        emit TransferReceived(msg.sender, msg.value);
    }
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

// pragma solidity ^0.8.0;

// contract SimpleTransfer {
//     address public senderAddress;
//     address public recipientAddress;
//     uint256 public transferAmount;
//     bool public isApproved;


//     constructor(address _senderAddress, address _recipientAddress, uint256 _transferAmount) {
//         senderAddress = _senderAddress;
//         recipientAddress = _recipientAddress;
//         transferAmount = _transferAmount;
//     }

//     function transfer() public {
//         require(msg.sender == senderAddress, "Only the sender can initiate the transfer");
//         require(address(this).balance >= transferAmount, "Insufficient balance in contract");
        
//         payable(recipientAddress).transfer(transferAmount);
//         isApproved = true;
//     }

//     function getContractBalance() public view returns (uint256) {
//     return address(this).balance;
// }


//     receive() external payable {}
// }

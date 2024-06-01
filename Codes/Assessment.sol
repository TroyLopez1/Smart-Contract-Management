// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Assessment {
    address public owner;
    mapping(address => uint256) private balances;

    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Withdraw amount must be greater than zero");
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function transfer(address _to, uint256 _amount) external {
        require(_amount > 0, "Transfer amount must be greater than zero");
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}

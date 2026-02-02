// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Donation {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    function donate() external payable {
        require(msg.value > 0, "Donation must be greater than 0");
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");

        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
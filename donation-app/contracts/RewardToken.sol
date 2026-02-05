// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    // initialOwner — это будет адрес главного контракта
    constructor(address initialOwner) ERC20("Donation Reward", "DRWD") Ownable(initialOwner) {}

    // Эту функцию будет вызывать главный контракт автоматически
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
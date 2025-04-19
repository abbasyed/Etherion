// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Etherion is ERC20, ERC20Burnable, Ownable, Pausable {
    uint256 private _feePercentage; // Fee in basis points (1/100 of a percent)
    address private _feeCollector;
    
    // Events
    event FeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeCollectorUpdated(address oldCollector, address newCollector);
    
    constructor(
        uint256 initialSupply,
        address initialOwner
    ) ERC20("Etherion", "ETN") Ownable(initialOwner) {
        _mint(initialOwner, initialSupply * 10 ** decimals());
        _feePercentage = 50; // 0.5% default fee
        _feeCollector = initialOwner;
    }
    
    // Pause token transfers
    function pause() public onlyOwner {
        _pause();
    }
    
    // Unpause token transfers
    function unpause() public onlyOwner {
        _unpause();
    }
    
    // Mint additional tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    // Set the fee percentage (in basis points, 1 = 0.01%)
    function setFeePercentage(uint256 newFeePercentage) public onlyOwner {
        require(newFeePercentage <= 1000, "Fee cannot exceed 10%");
        emit FeeUpdated(_feePercentage, newFeePercentage);
        _feePercentage = newFeePercentage;
    }
    
    // Set the fee collector address
    function setFeeCollector(address newFeeCollector) public onlyOwner {
        require(newFeeCollector != address(0), "Cannot set fee collector to zero address");
        emit FeeCollectorUpdated(_feeCollector, newFeeCollector);
        _feeCollector = newFeeCollector;
    }
    
    // Get current fee percentage
    function feePercentage() public view returns (uint256) {
        return _feePercentage;
    }
    
    // Get current fee collector
    function feeCollector() public view returns (address) {
        return _feeCollector;
    }
    
    // Override transfer function to include fee
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        uint256 fee = (amount * _feePercentage) / 10000;
        uint256 amountAfterFee = amount - fee;
        
        // Transfer fee to collector
        if (fee > 0) {
            super.transfer(_feeCollector, fee);
        }
        
        // Transfer remaining amount to recipient
        return super.transfer(to, amountAfterFee);
    }
    
    // Override transferFrom function to include fee
    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        uint256 fee = (amount * _feePercentage) / 10000;
        uint256 amountAfterFee = amount - fee;
        
        // Transfer fee to collector
        if (fee > 0) {
            super.transferFrom(from, _feeCollector, fee);
        }
        
        // Transfer remaining amount to recipient
        return super.transferFrom(from, to, amountAfterFee);
    }
    
    // Check balance including decimal conversion for easier reading
    function balanceOfInEth(address account) public view returns (uint256) {
        return balanceOf(account) / (10 ** decimals());
    }
}
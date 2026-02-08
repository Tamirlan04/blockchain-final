// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RewardToken.sol";

contract Donation {
    RewardToken public rewardToken;

    struct Campaign {
        address creator;
        string title;
        uint256 goal;
        uint256 raised;
        bool active;
    }

    Campaign[] public campaigns;

    
    event CampaignCreated(uint256 indexed id, string title, uint256 goal, address creator);
    event DonationReceived(uint256 indexed id, address donor, uint256 amount, uint256 rewards);

    constructor() {
        
        rewardToken = new RewardToken(address(this));
    }

    
    function createCampaign(string memory _title, uint256 _goal) public {
        campaigns.push(Campaign({
            creator: msg.sender,
            title: _title,
            goal: _goal,
            raised: 0,
            active: true
        }));
        emit CampaignCreated(campaigns.length - 1, _title, _goal, msg.sender);
    }

    
    function donate(uint256 _campaignId) public payable {
        require(_campaignId < campaigns.length, "Campaign does not exist");
        require(msg.value > 0, "Send some ETH");
        require(campaigns[_campaignId].active, "Campaign is not active");

        campaigns[_campaignId].raised += msg.value;
        
        
        uint256 rewardAmount = msg.value * 100; 
        rewardToken.mint(msg.sender, rewardAmount); 

        emit DonationReceived(_campaignId, msg.sender, msg.value, rewardAmount);
    }

    
    function getCampaignCount() public view returns (uint256) {
        return campaigns.length;
    }
}
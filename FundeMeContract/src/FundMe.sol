// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract FundMe {
    // Events for frontend tracking
    event CampaignCreated(uint256 indexed id, address indexed owner, string title, uint256 target, uint256 deadline);
    event DonationReceived(uint256 indexed id, address indexed donor, uint256 amount);
    event Withdrawal(uint256 indexed id, address indexed owner, uint256 amount);
    event Refund(uint256 indexed id, address indexed donor, uint256 amount);
    event CampaignCancelled(uint256 indexed id);

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        mapping(address => uint256) donations;
        address[] donators;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    function createCampaign(string memory _title, string memory _description, uint256 _target, uint256 _deadline) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(_deadline > block.timestamp, "Deadline should be in the future");

        campaign.owner = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;

        numberOfCampaigns++;

        emit CampaignCreated(numberOfCampaigns - 1, msg.sender, _title, _target, _deadline);

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];
        // Remove deadline check to allow donations after campaign ends
        // require(block.timestamp < campaign.deadline, "Campaign has ended");
        campaign.donations[msg.sender] += msg.value;
        campaign.donators.push(msg.sender);
        campaign.amountCollected += msg.value;
        emit DonationReceived(_id, msg.sender, msg.value);
    }

    function withdraw(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];

        require(msg.sender == campaign.owner, "Only the campaign owner can withdraw funds");
        require(block.timestamp > campaign.deadline, "Campaign has not ended yet");

        uint256 amount = campaign.amountCollected;
        campaign.amountCollected = 0;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Failed to send Ether");
        emit Withdrawal(_id, msg.sender, amount);
    }

    function cancelCampaign(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Only the campaign owner can cancel the campaign");
        require(block.timestamp < campaign.deadline, "Cannot cancel after deadline");
        uint256 numDonators = campaign.donators.length;
        for (uint256 i = 0; i < numDonators; i++) {
            address donor = campaign.donators[i];
            uint256 donation = campaign.donations[donor];
            if (donation > 0) {
                campaign.donations[donor] = 0;
                campaign.amountCollected -= donation;
                (bool sent, ) = payable(donor).call{value: donation}("");
                if (sent) {
                    emit Refund(_id, donor, donation);
                }
            }
        }
        emit CampaignCancelled(_id);
    }

    function refundDonor(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        uint256 donation = campaign.donations[msg.sender];
        require(donation > 0, "No donation to refund");
        campaign.donations[msg.sender] = 0;
        campaign.amountCollected -= donation;
        (bool sent, ) = payable(msg.sender).call{value: donation}("");
        require(sent, "Refund failed");
        emit Refund(_id, msg.sender, donation);
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        Campaign storage campaign = campaigns[_id];
        
        address[] memory _donators = campaign.donators;
        uint256[] memory _donations = new uint256[](_donators.length);

        for(uint256 i = 0; i < _donators.length; i++) {
            _donations[i] = campaign.donations[_donators[i]];
        }

        return (_donators, _donations);
    }

    function getCampaign(uint256 _id) view public returns (
        address owner,
        string memory title,
        string memory description,
        uint256 target,
        uint256 deadline,
        uint256 amountCollected
    ) {
        Campaign storage campaign = campaigns[_id];

        return (
            campaign.owner,
            campaign.title,
            campaign.description,
            campaign.target,
            campaign.deadline,
            campaign.amountCollected
        );
    }


    function getAllCampaigns() public view returns (
        address[] memory,
        string[] memory,
        string[] memory,
        uint256[] memory,
        uint256[] memory,
        uint256[] memory
    ) {
        address[] memory owners = new address[](numberOfCampaigns);
        string[] memory titles = new string[](numberOfCampaigns);
        string[] memory descriptions = new string[](numberOfCampaigns);
        uint256[] memory targets = new uint256[](numberOfCampaigns);
        uint256[] memory deadlines = new uint256[](numberOfCampaigns);
        uint256[] memory amountsCollected = new uint256[](numberOfCampaigns);

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            owners[i] = campaign.owner;
            titles[i] = campaign.title;
            descriptions[i] = campaign.description;
            targets[i] = campaign.target;
            deadlines[i] = campaign.deadline;
            amountsCollected[i] = campaign.amountCollected;
        }

        return (owners, titles, descriptions, targets, deadlines, amountsCollected);
    }
}
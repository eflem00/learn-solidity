// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

contract CampaignFactory {
    address[] deployedCampaigns;

    function createCampaign(uint256 minCont) public {
        Campaign campaign = new Campaign(minCont, msg.sender);
        deployedCampaigns.push(address(campaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint256 approvalCount;
    }

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    Request[] public requests;

    constructor(uint256 minCont, address mgr) {
        manager = mgr;
        minimumContribution = minCont;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    /**
     * In newer versions of solidity, mappings cannot be allocated in memory
     */
    function request(
        string memory description,
        uint256 value,
        address payable recipient
    ) public restricted {
        Request storage req = requests.push();
        req.description = description;
        req.value = value;
        req.recipient = recipient;
        req.complete = false;
        req.approvalCount = 0;

        // Request memory req = Request({ description: description, value: value, recipient: recipient, complete: false, approvalCount: 0 });
        // requests.push(req);
    }

    function approveRequest(uint256 requestIndex) public {
        Request storage req = requests[requestIndex];

        require(approvers[msg.sender]);
        require(!req.approvals[msg.sender]);

        req.approvals[msg.sender] = true;
        req.approvalCount++;
    }

    function finalizeRequest(uint256 requestIndex) public restricted {
        Request storage req = requests[requestIndex];

        require(!req.complete);
        require(req.approvalCount > (approversCount / 2));

        req.complete = true;
        req.recipient.transfer(req.value);
    }
}

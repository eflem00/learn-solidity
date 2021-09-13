// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "usingtellor/contracts/UsingTellor.sol";

contract MyOracle is UsingTellor {
    //This contract now has access to all functions in UsingTellor

    uint256 btcPrice;
    uint256 btcRequestId = 2;

    constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) {}

    function setBtcPrice() public {
        bool _didGet;
        uint256 _timestamp;

        (_didGet, btcPrice, _timestamp) = getCurrentValue(btcRequestId);
    }
}

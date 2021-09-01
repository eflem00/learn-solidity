// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

contract Lottery {
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function pickWinner() public restricted {
        uint256 seed = random();
        address payable winner = players[seed % players.length];
        winner.transfer(address(this).balance);

        players = new address payable[](0);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }
}

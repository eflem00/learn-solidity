// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyErc20 is ERC20, Ownable {
    constructor() ERC20("MyERC20", "ERC20") {
        _mint(msg.sender, 1000);
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function mint() public onlyOwner {
        _mint(msg.sender, 1000);
    }
}

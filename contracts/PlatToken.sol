// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.0;

import "./tokens/TRC20.sol";
import "./tokens/TRC20Detailed.sol";

import "./role/Ownable.sol";

/**
 * @title SimpleToken
 * @dev Very simple TRC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `TRC20` functions.
 */
contract PlatToken is TRC20, TRC20Detailed, Ownable {
    


    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor ()  TRC20Detailed("PlatToken", "PLT", 18) public onlyOwner {
        _mint(msg.sender, 10000000000 * (10 ** uint256(decimals())));
    }
}



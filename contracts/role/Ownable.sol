// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.5.0;



contract Ownable {

    address private _owner;
     /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }
    
    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view  returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view  {
        require(owner() == msg.sender, "Ownable: caller is not the owner");
    }

    
    
}



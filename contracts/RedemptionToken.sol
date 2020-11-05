pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";


/***
 * @notice - issued a redemption token.
 **/
contract RedemptionToken is ERC20 {
    using SafeMath for uint;

    constructor() public ERC20("RedemptionToken", "RDT") {
        uint initialSupply = 1e8 * 1e18;  /// Initial Supply amount is 100M
        address initialTokenHolder = msg.sender;
        _mint(initialTokenHolder, initialSupply);    	
    }
    
}

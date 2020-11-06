pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/***
 * @notice - 
 **/
contract TimeLockObjects {

	struct Deposit {  /// [Key]: timelock ID -> user address
		//address depositedERC20;
		IERC20 depositedERC20;  /// [Note]: Contract address of the deposited ERC20 token
		uint depositedAmount;   /// [Note]: User recieve redemption tokens of same amount with amount that user deposited 
	}
	
}
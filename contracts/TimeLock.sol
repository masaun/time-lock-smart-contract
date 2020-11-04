pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";


/***
 * @notice - This contract that allows a user to send an amount of ERC20 token to a smart contract that takes custody of the asset for a pre-determined amount of time (e.g., 7 days) and issues a redemption token.
 **/
contract TimeLock {
    using SafeMath for uint;

    constructor() public {}

}

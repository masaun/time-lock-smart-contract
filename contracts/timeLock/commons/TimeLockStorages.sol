pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import { TimeLockObjects } from "./TimeLockObjects.sol";


/***
 * @notice - 
 **/
contract TimeLockStorages is TimeLockObjects {

    mapping (uint => mapping(address => Deposit)) deposits;  /// [Key]: timelock ID -> user address

}
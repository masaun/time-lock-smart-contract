pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

import "./RedemptionToken.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";


/***
 * @notice - This contract that allows a user to send an amount of ERC20 token to a smart contract that takes custody of the asset for a pre-determined amount of time (e.g., 7 days) and issues a redemption token.
 **/
contract TimeLock {
    using SafeMath for uint;

    uint lockedPeriod = 7 days;  /// [Note]: Default locked period is 7 days.

    RedemptionToken public redemptionToken;

    constructor(RedemptionToken _redemptionToken) public {
        redemptionToken = _redemptionToken;
    }

    /***
     * @notice - User deposit an amount of ERC20 token and recieve a redemption token.
     **/
    function deposit(IERC20 _erc20, uint amount) public returns (bool) {
        /// User deposit an amount of ERC20 token
        IERC20 erc20 = _erc20;
        erc20.transferFrom(msg.sender, address(this), amount);  /// [Note]: This deposit amount should be approved by an user before the deposit method is executed.

        /// User recieve a redemption token
        _distributeRedemptionToken(msg.sender, amount);
    }

    /***
     * @notice - A redemption token will be distributed into the specified address
     **/    
    function _distributeRedemptionToken(address to, uint amount) internal returns (bool) {
        redemptionToken.transfer(to, amount);
    }

    /***
     * @notice - the method should allow the user to reclaim the asset using by exchanging the redemption token for the original amount of asset
     **/
    function redeem(IERC20 _erc20, RedemptionToken _redemptionToken, uint amount) public returns (bool) {  /// [Note]: Redeem is same mean with "withdraw"
        /// User deposit an amount of Redemption token
        redemptionToken.transferFrom(msg.sender, address(this), amount);  /// [Note]: This deposit amount should be approved by an user before the deposit method is executed.

        /// User recieve a redemption token
        _distributeERC20Token(_erc20, msg.sender, amount);        
    } 

    /***
     * @notice - ERC20 token (that an user was deposited) will be distributed into the user who was deposited
     **/    
    function _distributeERC20Token(IERC20 _erc20, address to, uint amount) internal returns (bool) {
        IERC20 erc20 = _erc20;
        erc20.transfer(to, amount);
    }
    
}

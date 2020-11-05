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

    uint currentTimelockId;  /// Time lock ID

    uint lockedPeriod = 7 days;                          /// [Note]: Default locked period is 7 days.
    mapping (uint => mapping(address => uint)) periods;  /// [Note]: Save a timestamp of the period. 
                                                         /// [Key]: timelock ID -> user address               

    RedemptionToken public redemptionToken;

    constructor(RedemptionToken _redemptionToken) public {
        redemptionToken = _redemptionToken;
    }

    /***
     * @notice - User deposit an amount of ERC20 token and recieve a redemption token.
     **/
    function deposit(IERC20 _erc20, uint amount) public returns (uint _newTimelockId) {
        /// User deposit an amount of ERC20 token
        IERC20 erc20 = _erc20;
        erc20.transferFrom(msg.sender, address(this), amount);  /// [Note]: This deposit amount should be approved by an user before the deposit method is executed.

        /// Start to the locked period
        uint newTimelockId = getNextTimelockId();
        currentTimelockId++;
        periods[newTimelockId][msg.sender] = now.add(lockedPeriod);

        /// User recieve a redemption token
        _distributeRedemptionToken(msg.sender, amount);

        return newTimelockId;
    }

    /***
     * @notice - the method should allow the user to reclaim the asset using by exchanging the redemption token for the original amount of asset
     **/
    function redeem(uint timelockId, IERC20 _erc20, RedemptionToken _redemptionToken, uint amount) public returns (bool) {  /// [Note]: Redeem is same mean with "withdraw"
        /// Check whether the locked period has been passed or not
        require (periods[timelockId][msg.sender] < now, "This deposit has not been passed the time lock period");

        /// User deposit an amount of the redemption tokens
        //redemptionToken.transferFrom(msg.sender, address(this), amount);  /// [Note]: This deposit amount should be approved by an user before the deposit method is executed.

        /// Burn the redemption tokens
        redemptionToken.burn(msg.sender, amount);

        /// User recieve redemption tokens
        _distributeERC20Token(_erc20, msg.sender, amount);        
    } 

    /***
     * @notice - Update to the latest price
     **/
    function updatePrice() public {
        /// cast to uint256 * add 10 decimals of precision
        linkPrice = uint256(fetchlinkPrice()).mul(10**10);
    }

    /***
     * @notice - etch eth price from chainlink
     **/
    function fetchlinkPrice() public view returns (int256) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = linkPriceFeed.latestRoundData();
        // If the round is not complete yet, timestamp is 0
        require(timeStamp > 0, "Round not complete");
        return price;
    }


    ///------------------------------------------------------------
    /// Internal functions
    ///------------------------------------------------------------

    /***
     * @notice - A redemption token will be distributed into the specified address
     **/    
    function _distributeRedemptionToken(address to, uint amount) internal returns (bool) {
        redemptionToken.transfer(to, amount);
    }

    /***
     * @notice - ERC20 token (that an user was deposited) will be distributed into the user who was deposited
     **/    
    function _distributeERC20Token(IERC20 _erc20, address to, uint amount) internal returns (bool) {
        IERC20 erc20 = _erc20;
        erc20.transfer(to, amount);
    }


    ///------------------------------------------------------------
    /// Getter functions
    ///------------------------------------------------------------


    ///------------------------------------------------------------
    /// Private functions
    ///------------------------------------------------------------

    function getNextTimelockId() private view returns (uint nextTimelockId) {
        return currentTimelockId.add(1);
    }

}

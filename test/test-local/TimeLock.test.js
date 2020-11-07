/////////////////////////////////
/// Testing on the local
////////////////////////////////

require('dotenv').config();

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

/// TimeLock contract instance
let TimeLock = {};
TimeLock = artifacts.require("TimeLock");

const timeLockABI = TimeLock.abi;
const timeLockAddr = TimeLock.address;
let timeLock = new web3.eth.Contract(timeLockABI, timeLockAddr);

/// RedemptionToken contract instance
let RedemptionToken = {};
RedemptionToken = artifacts.require("RedemptionToken");

const REDEMPTION_TOKEN_ABI = RedemptionToken.abi;
const REDEMPTION_TOKEN = RedemptionToken.address;
let redemptionToken = new web3.eth.Contract(REDEMPTION_TOKEN_ABI, REDEMPTION_TOKEN);

/// DAI (mock) contract instance
let DAI = {};
DAI = artifacts.require("DAIMockToken");

const daiABI = DAI.abi;
const daiAddr = DAI.address;
let dai = new web3.eth.Contract(daiABI, daiAddr);


/***
 * @dev - [Execution]: $ truffle test ./test/test-rinkeby/TimeLock.test.js --network local
 **/
contract("TimeLock contract", function (accounts) {

    /// Set up wallet
    let walletAddress1 = accounts[0];

	it('Current locked period should be 7 days', async () => {
        let currentLockedPeriod = await timeLock.methods.lockedPeriod().call();
        const sevenDays = (60 * 60 * 24) * 7;

        console.log("\n=== currentLockedPeriod ===", currentLockedPeriod);
        console.log("=== sevenDays (7 days) ===", sevenDays);

        assert.equal(currentLockedPeriod, sevenDays, 'Current locked period should be 7 days'); /// [Result]: Success
    });

	it('Current locked period should be changed (from 7 days) to 1 second', async () => {
        let currentLockedPeriodBefore = await timeLock.methods.lockedPeriod().call();
        console.log("\n=== currentLockedPeriod (Before) ===", currentLockedPeriodBefore);

        const second = 0;    /// 0 second
        //const second = 1;  /// 1 second
        let changedLockedPeriod = await timeLock.methods.updateLockedPeriod(second).send({ from: accounts[0] });

        let currentLockedPeriodAfter = await timeLock.methods.lockedPeriod().call();
        console.log("=== currentLockedPeriod (After) ===", currentLockedPeriodAfter);

        assert.equal(currentLockedPeriodAfter, second, 'Current locked period should be changed (from 7 days) to 5 second'); /// [Result]: Success
    });

    it('Initial DAI balance should be 100M', async () => {  /// [Note]: DAI is mock ERC20 token
        let daiBalance = await dai.methods.balanceOf(walletAddress1).call();
        const initialSupply = 1e8 * 1e18;

        console.log("\n=== daiBalance ===", daiBalance);
        console.log("=== initialSupply ===", initialSupply);

        assert.equal(daiBalance, initialSupply, 'Initial DAI balance should be 100M'); /// [Result]: Success
    });

    it('Deposited amount should be 100 DAI and new time lock ID should be 1', async () => {
        const TIME_LOCK = timeLockAddr;
        const DAI_ADDRESS = daiAddr;
        const amount = web3.utils.toWei('100', 'ether');

        /// Transfer the Redemption Tokens into contract (from reciever of initial supply) in advance
        let transferred = await redemptionToken.methods.transfer(timeLockAddr, amount).send({ from: walletAddress1 });

        /// Deposit any ERC20 token
        let approved = await dai.methods.approve(timeLockAddr, amount).send({ from: walletAddress1 });
        let deposited = await timeLock.methods.deposit(DAI_ADDRESS, amount).send({ from: walletAddress1, gas: 3000000 });  /// [Note]: { gas: 3000000 } is important to avoid an error of "out of gas"

        /// Check whether result is correct or not
        const currentTimelockId = await timeLock.methods.currentTimelockId().call();
        const timelockId = currentTimelockId;
        const depositor = walletAddress1;
        let deposit = await timeLock.methods.getDeposit(timelockId, depositor).call();
        let _depositedAmount = deposit.depositedAmount;

        let balanceOfTimeLockContract = await dai.methods.balanceOf(timeLockAddr).call();

        console.log("\n=== currentTimelockId ===", currentTimelockId);
        console.log("=== balanceOfTimeLockContract ===", balanceOfTimeLockContract);

        assert.equal(balanceOfTimeLockContract, _depositedAmount, 'Deposited amount should be 100 DAI'); /// [Result]: Success
        assert.equal(currentTimelockId, 1, 'New time lock ID should be 1'); /// [Result]: Success
    });

    it('Redeemed amount should be 100 DAI', async () => {
        const timelockId = 1;        
        const amount = web3.utils.toWei('100', 'ether');

        /// Redeem the Redemption Tokens with the deposited ERC20 token
        let redeemed = await timeLock.methods.redeem(timelockId, amount).send({ from: walletAddress1, gas: 3000000 });  /// [Note]: { gas: 3000000 } is important to avoid an error of "out of gas"
    });

});
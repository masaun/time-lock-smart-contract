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

	it('Current locked period should be 7 days', async () => {
        let currentLockedPeriod = await timeLock.methods.lockedPeriod().call();
        const sevenDays = (60 * 60 * 24) * 7;

        console.log("\n=== currentLockedPeriod ===", currentLockedPeriod);
        console.log("=== sevenDays (7 days) ===", sevenDays);

        assert.equal(currentLockedPeriod, sevenDays, 'Current locked period should be 7 days'); /// [Result]: Success
    });

	it('Current locked period should be changed (from 7 days) to 5 second', async () => {
        let currentLockedPeriodBefore = await timeLock.methods.lockedPeriod().call();
        console.log("\n=== currentLockedPeriod (Before) ===", currentLockedPeriodBefore);

        const fiveSecond = 5;  /// 5 second
        let changedLockedPeriod = await timeLock.methods.updateLockedPeriod(fiveSecond).send({ from: accounts[0] });

        let currentLockedPeriodAfter = await timeLock.methods.lockedPeriod().call();
        console.log("=== currentLockedPeriod (After) ===", currentLockedPeriodAfter);

        assert.equal(currentLockedPeriodAfter, fiveSecond, 'Current locked period should be changed (from 7 days) to 5 second'); /// [Result]: Success
    });

    it('Initial DAI balance should be 100M', async () => {  /// [Note]: DAI is mock ERC20 token
        const walletAddress = accounts[0];

        let daiBalance = await dai.methods.balanceOf(walletAddress).call();
        const initialSupply = 1e8 * 1e18;

        console.log("\n=== daiBalance ===", daiBalance);
        console.log("=== initialSupply ===", initialSupply);

        assert.equal(daiBalance, initialSupply, 'Initial DAI balance should be 100M'); /// [Result]: Success
    });

});
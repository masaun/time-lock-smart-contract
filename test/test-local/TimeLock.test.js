/////////////////////////////////
/// Testing on the local
////////////////////////////////

require('dotenv').config();

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

let TimeLock = {};
TimeLock = artifacts.require("TimeLock");

const timeLockABI = TimeLock.abi;
const timeLockAddr = TimeLock.address;
let timeLock = new web3.eth.Contract(timeLockABI, timeLockAddr);


/***
 * @dev - [Execution]: $ truffle test ./test/test-rinkeby/TimeLock.test.js --network local
 **/
contract("TimeLock contract", function (accounts) {

	it('Current locked period should be 7 days', async () => {
        let currentLockedPeriod = await timeLock.methods.lockedPeriod().call();
        const sevenDays = (60 * 60 * 24) * 7;

        console.log("=== currentLockedPeriod ===", currentLockedPeriod);
        console.log("=== sevenDays (7 days) ===", sevenDays);

        assert.equal(currentLockedPeriod, sevenDays, 'Current locked period should be 7 days'); /// [Result]: Success
    });

	it('Current locked period should be changed (from 7 days) to 5 second', async () => {
        let currentLockedPeriodBefore = await timeLock.methods.lockedPeriod().call();
        console.log("=== currentLockedPeriod (Before) ===", currentLockedPeriodBefore);

        const fiveSecond = 5;  /// 5 second
        let changedLockedPeriod = await timeLock.methods.updateLockedPeriod(fiveSecond).send({ from: accounts[0] });

        let currentLockedPeriodAfter = await timeLock.methods.lockedPeriod().call();
        console.log("=== currentLockedPeriod (After) ===", currentLockedPeriodAfter);

        assert.equal(currentLockedPeriodAfter, fiveSecond, 'Current locked period should be 7 days'); /// [Result]: Success
    });


});
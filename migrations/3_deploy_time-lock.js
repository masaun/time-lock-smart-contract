const TimeLock = artifacts.require("TimeLock");
const RedemptionToken = artifacts.require("RedemptionToken");

const _redemptionToken = RedemptionToken.address;

module.exports = function(deployer) {
    deployer.deploy(TimeLock, _redemptionToken);
};

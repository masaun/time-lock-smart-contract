const RedemptionToken = artifacts.require("RedemptionToken");

module.exports = function(deployer) {
    deployer.deploy(RedemptionToken);
};

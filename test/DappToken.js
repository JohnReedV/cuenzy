const _deploy_contracts = require("../migrations/2_deploy_contracts");

var DappToken = artifacts.require("DappToken");

contract("DappToken", function(accounts) {
    var tokenInstance;

    it("initializes the contract with the correct values", function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name) {
            assert.equal(name, "Cuenzy", "has the correct name");
            return tokenInstance.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, "CNZ", "has the correct symbol");
            return tokenInstance.standard();
        }).then(function(standard) {
            assert.equal(standard, "Cuenzy V1.0")
        });
    });

    it("sets the total supply upon deployment", function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 10000000, "sets the total supply to a milly");
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), 10000000, "allocate init supply to the admin account");
        });
    });

    it('transfers token ownership', function() {
        return DappToken.deployed().then(function(instance) {
          tokenInstance = instance;
          return tokenInstance.transfer.call(accounts[1], 99999999999999999999999);
        }).then(assert.fail).catch(function(error) {
          assert(error.message, "error message must contain revert");
          return tokenInstance.transfer.call(accounts[1], 2500000, { from: accounts[0] });
        }).then(function(success) {
          assert.equal(success, true, 'it returns true');
          return tokenInstance.transfer(accounts[1], 2500000, { from: accounts[0] });
        }).then(function(receipt) {
          assert.equal(receipt.logs.length, 1, 'triggers one event');
          assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
          assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
          assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
          assert.equal(receipt.logs[0].args._value, 2500000, 'logs the transfer amount');
          return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 2500000, 'adds the amount to the receiving account');
          return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 7500000, 'deducts the amount from the sending account');
        });
      });
});

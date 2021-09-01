const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { bytecode, interface } = require("../compile");

describe("Lottery", () => {
  let accounts;
  let contract;
  beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use an account to deploy contract
    const cnt = new web3.eth.Contract(interface);
    contract = await cnt
      .deploy({ data: bytecode })
      .send({ from: accounts[0], gas: "1000000" });
  });

  it("initializes manager as contract creator", async () => {
    const manager = await contract.methods.manager().call();

    assert.equal(manager, accounts[0]);
  });

  it("enter adds callers as players", async () => {
    await contract.methods.enter().send({
      from: accounts[0],
      gas: "1000000",
      value: web3.utils.toWei("1", "ether"),
    });
    await contract.methods.enter().send({
      from: accounts[1],
      gas: "1000000",
      value: web3.utils.toWei("1", "ether"),
    });
    await contract.methods.enter().send({
      from: accounts[2],
      gas: "1000000",
      value: web3.utils.toWei("1", "ether"),
    });

    const players = await contract.methods.getPlayers().call();

    assert(players.length === 3);
    assert.equal(players[0], accounts[0]);
    assert.equal(players[1], accounts[1]);
    assert.equal(players[2], accounts[2]);
  });

  it("enter asserts value is at least 0.1 eth", async () => {
    try {
      await contract.methods.enter().send({
        from: accounts[0],
        gas: "1000000",
        value: web3.utils.toWei("0.001", "ether"),
      });
      assert(false, "exception was expected.");
    } catch (ex) {
      assert.equal(
        ex.message,
        "VM Exception while processing transaction: revert"
      );
    }
  });

  it("pick winner must be called by manager", async () => {
    try {
      await contract.methods.pickWinner().call({
        from: accounts[1],
        gas: "1000000",
      });
      assert(false, "exception was expected.");
    } catch (ex) {
      assert.equal(
        ex.message,
        "VM Exception while processing transaction: revert"
      );
    }
  });

  it("pick winner picks player and transfers money and then resets players list", async () => {
    const prevBalance = await web3.eth.getBalance(accounts[0]);

    await contract.methods.enter().send({
      from: accounts[0],
      gas: "1000000",
      value: web3.utils.toWei("1", "ether"),
    });

    await contract.methods.pickWinner().send({
      from: accounts[0],
      gas: "1000000",
    });

    const newBalance = await web3.eth.getBalance(accounts[0]);

    const difference = prevBalance - newBalance;
    assert.ok(difference < web3.utils.toWei("0.1", "ether"));

    const players = await contract.methods.getPlayers().call();
    assert(players.length === 0);

    const contractBalance = await web3.eth.getBalance(contract.options.address);
    assert.equal(contractBalance, 0);
  });
});

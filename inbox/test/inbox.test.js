const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { bytecode, interface } = require("../compile");

describe("Inbox", () => {
  let accounts;
  let inbox;
  beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use an account to deploy contract
    const contract = new web3.eth.Contract(interface);
    inbox = await contract
      .deploy({ data: bytecode, arguments: ["Hi there!"] })
      .send({ from: accounts[0], gas: "1000000" });
  });

  it("initializes message with constructor arg", async () => {
    const message = await inbox.methods.message().call();

    assert.equal(message, "Hi there!");
  });

  it("upadates message when setMessage called", async () => {
    await inbox.methods
      .setMessage("New message")
      .send({ from: accounts[0], gas: "1000000" });
    const message = await inbox.methods.message().call();

    assert.equal(message, "New message");
  });
});

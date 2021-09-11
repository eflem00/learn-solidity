const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const compiledCampaign = require("../ethereum/build/campaign.json");
const compiledCampaignFactory = require("../ethereum/build/campaignfactory.json");

describe("Lottery", () => {
  let accounts;
  let campaign;
  let campaignAddress;

  beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use an account to deploy contract
    const contract = new web3.eth.Contract(compiledCampaignFactory.interface);
    factory = await contract
      .deploy({ data: compiledCampaignFactory.bytecode })
      .send({ from: accounts[0], gas: "1000000" });

    await factory.methods
      .createCampaign("100")
      .send({ from: accounts[0], gas: "1000000" });

    const campaigns = await factory.methods.getDeployedCampaigns().call();

    campaignAddress = campaigns[0];

    campaign = new web3.eth.Contract(
      compiledCampaign.interface,
      campaignAddress
    );
  });

  it("initializes manager as contract creator with min contribution", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);

    const minContribution = await campaign.methods.minimumContribution().call();
    assert.equal(minContribution, "100");
  });
});

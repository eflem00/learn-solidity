const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./build/campaignfactory.json");
const { seedPhrase } = require("../../env.json");

const provider = new HDWalletProvider(
  seedPhrase,
  "https://rinkeby.infura.io/v3/d5bdd657c4894e9297ec6cf7fabc5977"
);
const web3 = new Web3(provider);

const exec = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`Attempting to deploy from account: ${accounts[0]}`);

  const contract = new web3.eth.Contract(interface);
  const result = await contract
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000", gasPrice: "5000000000" });

  console.log(`Contract deployed to: ${result.options.address}`);
};

exec();

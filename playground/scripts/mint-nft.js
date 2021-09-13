const env = require("dotenv");
const { ethers } = require("ethers");
const { abi } = require("../artifacts/contracts/my-nft.sol/MyNFT.json");

env.config();
const { PUBLIC_KEY, CONTRACT_ADDRESS, API_ID, PRIVATE_KEY } = process.env;

const provider = new ethers.providers.InfuraProvider("rinkeby", API_ID);

const wallet = new ethers.Wallet(PRIVATE_KEY);
const signer = wallet.connect(provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

const exec = async () => {
  const tx = await contract.mintNFT(
    PUBLIC_KEY,
    "https://gateway.pinata.cloud/ipfs/QmarPqdEuzh5RsWpyH2hZ3qSXBCzC5RyK3ZHnFkAsk7u2f"
  );
  await tx.wait();
  console.log(`NFT Minted! Tx: ${tx.hash}`);
};

exec()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

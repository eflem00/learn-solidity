const fs = require("fs");
const path = require("path");
const solc = require("solc");

const filePath = path.resolve(__dirname, "contracts", "lottery.sol");
const file = fs.readFileSync(filePath, "utf8");

const result = JSON.parse(
  solc.compile(
    JSON.stringify({
      language: "Solidity",
      sources: {
        Lottery: {
          content: file,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    })
  )
);

module.exports = {
  bytecode: result.contracts.Lottery.Lottery.evm.bytecode.object,
  interface: result.contracts.Lottery.Lottery.abi,
};

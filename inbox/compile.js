const fs = require("fs");
const path = require("path");
const solc = require("solc");

const filePath = path.resolve(__dirname, "contracts", "inbox.sol");
const file = fs.readFileSync(filePath, "utf8");

const result = JSON.parse(
  solc.compile(
    JSON.stringify({
      language: "Solidity",
      sources: {
        Inbox: {
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
  bytecode: result.contracts.Inbox.Inbox.evm.bytecode.object,
  interface: result.contracts.Inbox.Inbox.abi,
};

const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

const result = JSON.parse(
  solc.compile(
    JSON.stringify({
      language: "Solidity",
      sources: {
        Campaign: {
          content: source,
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

fs.ensureDirSync(buildPath);

for (const [key, value] of Object.entries(result.contracts.Campaign)) {
  fs.outputJsonSync(path.resolve(buildPath, `${key}.json`.toLowerCase()), {
    interface: value.abi,
    bytecode: value.evm.bytecode.object,
  });
}

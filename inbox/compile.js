const fs = require('fs');
const path = require('path');
const solc = require('solc');

const filePath = path.resolve(__dirname, 'contracts', 'inbox.sol')
const file = fs.readFileSync(filePath, 'utf8');

const result = solc.compile(file, 1)

const {bytecode, interface} = result.contracts[':Inbox'];

module.exports = { bytecode, interface: JSON.parse(interface) };
const solc = require('solc');
const fs = require('fs');
const path = require('path');

const contractsDir = path.join(__dirname, '..', 'build', 'contracts');
const abiPath = path.join(__dirname, '..', 'src', 'abi');

if (!fs.existsSync(abiPath)) fs.mkdirSync((abiPath));

function writeABI(name) {
  const { abi } = require(path.join(contractsDir, name));
  fs.writeFileSync(
    path.join(abiPath, `${name}.json`),
    JSON.stringify(abi, null, 2)
  );
}

const contracts = ['IERC20', 'ICERC20', 'Compounder'];
contracts.map(writeABI);
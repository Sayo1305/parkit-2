const { SEPOLIA_PRIVATE_KEY, PrivateKey } = require("./key");

require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: SEPOLIA_PRIVATE_KEY,
      accounts: [PrivateKey],
    }
  }
};

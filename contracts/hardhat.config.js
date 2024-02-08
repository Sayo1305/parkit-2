const { SEPOLIA_PRIVATE_KEY, PrivateKey } = require("./key");

require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
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

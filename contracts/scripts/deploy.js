const hre = require("hardhat");

async function main() {
  const lock = await hre.ethers.deployContract("ParkingContract");

  await lock.waitForDeployment();

  console.log(`your contract deployed at ${lock.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
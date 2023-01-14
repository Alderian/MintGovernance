const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  // Get owner address
  const [owner] = await ethers.getSigners();

  const transactionCount = await owner.getTransactionCount();

  // gets the address of the token before it is deployed
  const futureAddress = ethers.utils.getContractAddress({
    from: owner.address,
    nonce: transactionCount + 1,
  });

  const MyGovernor = await ethers.getContractFactory("MyGovernor");
  const governor = await MyGovernor.deploy(
    futureAddress,
    25 /* 5 minutes */,
    300 /* 1 hour */
  );

  const MyToken = await ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy(governor.address);

  console.log(
    `Governor deployed to ${governor.address}`,
    `Token deployed to ${token.address}`
  );

  // Put contract addresses in this file to use in other scripts
  fs.writeFileSync(
    "./scripts/_contracts.js",
    `module.exports = {\n    governorAddress: "${governor.address}",\n    tokenAddress: "${token.address}"\n};`
  );

  // 2. Delegate
  await token.delegate(owner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

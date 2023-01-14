const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;
const fs = require("fs");
const { governorAddress, tokenAddress } = require("./_contracts");
const moveBlocks = require("../utils/moveBlocks");

/**
 * Deben haber pasado los 5 minutos que están configurados en el deploy del contrato
 */
async function main() {
  // Get owner address
  const [owner] = await ethers.getSigners();

  const governor = await ethers.getContractAt("MyGovernor", governorAddress);
  const token = await ethers.getContractAt("MyToken", tokenAddress);

  const tx = await governor.propose(
    [token.address],
    [0],
    [
      token.interface.encodeFunctionData("mint", [
        owner.address,
        parseEther("25000"),
      ]),
    ],
    "Give the owner more tokens!"
  );
  const receipt = await tx.wait();
  const event = receipt.events.find((x) => x.event === "ProposalCreated");
  const { proposalId } = event.args;

  console.log(`Proposal created with id ${proposalId}`);

  proposalState = await governor.state(proposalId);
  console.log(`Current Proposal State: ${proposalState}`);

  // Put contract addresses in this file to use in other scripts
  fs.writeFileSync(
    "./scripts/_lastProposal.js",
    `module.exports = {\n    proposalId: "${proposalId}"\n};`
  );

  // Go ahead of time to make it active
  moveBlocks(votingDelay + 1);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

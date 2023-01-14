module.exports = async function moveBlocks(amount) {
  for (let index = 0; index < amount; index++) {
    await hre.network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
};

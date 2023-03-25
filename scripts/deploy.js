const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

// Deploying contract here
async function main() {
  
  // Setup accounts and variables
  const [deployer] = await ethers.getSigners()
  const NAME = "Dappcord"
  const SYMBOL = "DC"

  // Deploy contract
  const Dappcord = await ethers.getContractFactory("Dappcord")
  const dappcord = await Dappcord.deploy(NAME, SYMBOL)
  await dappcord.deployed() // Wait for deployment to actually finishes

  console.log(`Deployed Dappcord Contract at: ${dappcord.address}\n`);

  const CHANNEL_NAMES = ['general', 'intro', 'jobs']
  const COSTS = [tokens(1), tokens(0), tokens(0.25)]

  for(let i=0; i<3; i++) {
    // Creating three channels
    const txn = await dappcord.connect(deployer).createChannel(CHANNEL_NAMES[i], COSTS[i])
    await txn.wait()
    console.log(`Created text channel #${CHANNEL_NAMES[i]}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
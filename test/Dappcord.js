const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (eth) => {
  return ethers.utils.parseUnits(eth.toString(), 'ether')
}

// testing a contract

describe("Dappcord", function () {

  // Rather than fetching and deploying the contract again and again, we can do it before each test

  let dappcord, deployer, user
  const NAME = "Dappcord"
  const SYMBOL = "DC"

  beforeEach(async() => {

    // wallets connected to ethers via hardhat can be accessed using getSigners
    // getSigners returns an array of all the accounts that are connected to hardhat test

    // Setup Accounts
    // deployer is account [0], user is account [1]
    [deployer, user] = await ethers.getSigners()

    // Same thing as deployer = signers[0], user = signers[1] is it was saved to a signers variable

    // Deploy Contract
    const Dappcord = await ethers.getContractFactory("Dappcord")
    dappcord = await Dappcord.deploy(NAME, SYMBOL)

    // Create a channel
    // We connect an account to the contract dappcord
    // The account we connect to dappcord is the deployer account we got from getSigners, which allows us to sign a private key to call a function createChannel of the contract, which will take gas
    const txn = await dappcord.connect(deployer).createChannel("general", tokens(1))
    await txn.wait()
  })

  // Check for the test in Deployment
  describe("Deployment", function() {
    // Check if the name and symbol are set
    it("Sets the name", async () => {
      // Deploying Contract

      // 1. Catch the contract from contractFactory
      // const Dappcord = await ethers.getContractFactory("Dappcord")

      // 2. Deploy the contract and pass the constructor args
      // const dappcord = await Dappcord.deploy("Dappcord", "DC")

      // 3. Catch the name and symbol from the deployed contract
      let result = await dappcord.name()
      
      // 4. Check if name and symbol are being set or not
      expect(result).to.be.equal(NAME)
    })
    
    it("Sets the symbol", async () => {
      // const Dappcord = await ethers.getContractFactory("Dappcord")
      // const dappcord = await Dappcord.deploy("Dappcord", "DC")
      let result = await dappcord.symbol()
      expect(result).to.be.equal(SYMBOL)
    })

    it("Sets the owner", async () => {
      const result = await dappcord.owner()
      // We can access the address of the deployer using the address method
      expect(result).to.be.equal(deployer.address)
    })
  })

  // Creating Channels
  describe("Creating Channels", () => {
    it('Returns total channels', async () => {
      const result = await dappcord.totalChannels();
      expect(result).to.be.equal(1)
    })
    
    it("Returns channel attributes", async() => {
      const channel = await dappcord.getChannel(1)
      expect(channel.id).to.be.equal(1)
      expect(channel.name).to.be.equal('general')
      expect(channel.cost).to.be.equal(tokens(1))
    })
  })

  // Joining Channels
  describe("Joining Channels", () => {
    const ID = 1
    const AMOUNT = tokens(1)

    beforeEach(async() => {
      // Now we mint nft using another account 'user', we call the mint fn and pass the ID, and the amount which we have to pay so that we can go forward with the txn
      const txn = await dappcord.connect(user).mint(ID, { value: AMOUNT })
      await txn.wait()
    })

    it("Joins the user", async() => {
      const result = await dappcord.hasJoined(ID, user.address)
      expect(result).to.be.equal(true)
    })

    it("Increases total supply", async() => {
      const result = await dappcord.totalSupply()
      expect(result).to.be.equal(ID)
    })

    it("Updates the contract balance", async() => {
      const result = await ethers.provider.getBalance(dappcord.address)
      expect(result).to.be.equal(AMOUNT)
    })
  })

  // Withdrawing funds
  describe("Withdrawing", () => {
    const ID = 1
    const AMOUNT = tokens(10)
    let balanceBefore

    beforeEach(async() => {
      // Get deployers initial balance
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      // Mint nft from 'user'/ another account
      let txn = await dappcord.connect(user).mint(ID, {value: AMOUNT})
      await txn.wait()

      // withdraw those funds using deployer account
      txn = await dappcord.connect(deployer).withdraw()
      await txn.wait()
    })

    it("Updates the owner balance", async() => {
      // balanceAfter withdraw will be more than what deployer had before withdrawing
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it("Updates the contract balance", async() => {
      // Balance in contract after withdrawl will be 0
      const result = await ethers.provider.getBalance(dappcord.address)
      expect(result).to.be.equal(0)
    })
  })
})

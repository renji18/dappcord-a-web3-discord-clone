# Dappcord
Dappcord is a decentralized discord clone where one can mint nft's and join a discord channel to have discussions about their favourite topics.

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)
- [Socket.io](https://socket.io/) (Client & Server communication)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)

## Working Of Contract

solidity version : ^0.8.9


Used an installed git contract for nft minting support

```
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
```

After inheriting ERC721 into our contract, we first create a constructor which takes ``` _name ``` and ```_symbol``` which we have to pass to the constructor of ERC721.

We also set the ```owner``` of the contract in the constructor itself.

We have a modifier ```onlyOwner``` which is used to check if ```msg.sender == owner``` of not.

We have a struct named ```Channel``` which works as a custom data type to store miscellaneous information about the channel, such as ```id```, ```name``` and ```cost```.

### The first function ```createChannel```
Takes ```_name``` and ```_cost``` of creating a channel. This function has a restriction of ```onlyOwner```.

Using mapping we set a unique key for every ```Channel``` prototype created.

### The second function ```mint```
Takes ```_id``` of the channel which they want to join. This function is invoked only if a user is not already a part of that particular channel which they want to access.

After verifying all the checks to see if they have not joined the channel, we let the user mint an NFT using the ```_safeMint``` function which we get from ERC721.

### The third function ```getChannel```
Also takes ```_id``` and returns the details related to that particular Channel. It is a view function that means it is read only.

### The forth function ```withdraw```
This function has a restriction of ```onlyOwner```. Which means that only the owner can withdraw the funds from the contract.

To compile the contract, run the following command
```bash
  npx hardhat compile
```

## Running Tests

To run tests, run the following command

```bash
  npx hardhat test
```

```
Dappcord
    Deployment
        Sets the name
        Sets the symbol
        Sets the owner
    Creating Channels
        Returns total channels
        Returns channel attributes
    Joining Channels
        Joins the user
        Increases total supply
        Updates the contract balance
    Withdrawing
        Updates the owner balance
        Updates the contract balance
```

### Before Each ```Deployment```

We deploy the contract and pass the ```NAME``` and ```SYMBOL``` attributes as constructor arguments.
We then create one test channel ```genereal``` for further tests.

### Before Each ```Joining Channels```

We use the ```mint``` function on the contract and pass the ```ID``` and the ```AMOUNT``` required for joining the particular channel.

### Before Each ```Withdrawing```

We make sure to connect the main owner/deployer to the contract and use the ```withdraw``` function on the contract.
## Server
My Server is set up using the express framework.

Using socket.io, we can set up and end to end live streaming text server.

Which can be done using
```
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})
```

The ```io``` has various methods to allow us to connect and emit events to run particular set of instructions.
## FrontEnd

We first need to require the abi's and the addess of where the contract was deployed.
We can get the abi from the ```./artifacts/contracts/${CONTRACT_NAME}/${CONTRACT_NAME}.json```

Copy the whole abi array and put it inside the ```./src``` of the react(In my case. You can do the same if you are using a vite, next or any other project) project.

### Connection to contract function ```loadBlockchainData```

We can access the provider or the account on the browser using
```
const provider = new ethers.providers.Web3Provider(window.ethereum);
```

We get the network details of the browser and the account using
```
const network = await provider.getNetwork();
```

We can connect to a metamask account from react using 
```
await window.ethereum.request({ method: 'eth_requestAccounts'})
```

Rest of the functionality is about using the data form various functions of the contract and setting up a good UI/UX where the user can join a channel, mint nft and send messages.

## 🚀 About Me

I am an up and coming full stack developer who has started small but has it all planned as to where I'll go.

I hope that you will be along with me on my journey and cheer for me if you see me worthy of it.
## 🛠 Skills
Nodejs, Express, React, MongoDb, Solidity, thirdweb, javascript, html, hbs
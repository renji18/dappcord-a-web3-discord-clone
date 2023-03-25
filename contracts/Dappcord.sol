// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Importing already created contracts
// We imported the ERC721 contract which is a standard for most of the NFT's out there, directly using openzepplin, installed in package json
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// We inherit a contract in our contract using 'is' keyword in our contract 
contract Dappcord is ERC721 {

  //state variable is a variable that is available throught the contract
  // address is the datatype
  // public is the visibility: The variable will be available even outside the contract
  // owner is the name
  address public owner;

  uint256 public totalChannels;
  uint256 public totalSupply;

  // Struct is a data type that allows us to define our custom data type with different data types as parameters
  struct Channel {
    uint256 id;
    string name;
    uint256 cost;
  }

  // Key value pair
  // It is like a hash table, for each key of uint256 it will take a value of data type Channel, and store the key-value pair in channels variable
  mapping(uint256 => Channel) public channels;

  mapping(uint256 => mapping(address => bool)) public hasJoined;

  // We created a constructor to our contract with values name and symbol and pass it to the constructor of ERC721
  constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
    owner = msg.sender; // msg is global variable, sender is property that references to the deployer or owner of the smart contract
  }

  // This checks for a particular statement to be true, BEFORE any of the other code is run
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function createChannel(string memory _name, uint256 _cost) public onlyOwner {
    // require checks if a statement is true or not
    // We want only the owner to be able to create a channel
    // If anyone other than the owner is creating a channel, then the function will revert.
    // But we can also do this using a modifier
    // require(msg.sender == owner);

    // Incrementing total number of channels;
    totalChannels++;

    // Creating a channel
    channels[totalChannels] = Channel(totalChannels, _name, _cost);
  }

  // payable means that this function is going to rqr currency to be paid to this function
  function mint(uint256 _id) public payable {

    require(_id != 0); // User id not 0
    require(_id <= totalChannels); // Joins an existing channel
    require(hasJoined[_id][msg.sender] == false); // User not already joined that channel
    require(msg.value >= channels[_id].cost); // makes sure that the amount recieved is more than or equal to the cost of joining that channel

    // join channel
    hasJoined[_id][msg.sender] = true;

    // Mint NFT
    totalSupply++;
    // _safeMint is a function from ERC721 which allows us to mint an NFT
    _safeMint(msg.sender, totalSupply);
  }

  // view = read only
  function getChannel(uint256 _id) public view returns(Channel memory) {
    return channels[_id];
  }

  // only the owner can withdraw the funds from the contract
  function withdraw() public onlyOwner {
    (bool success, ) = owner.call{value: address(this).balance}("");
    require(success);
  }
}

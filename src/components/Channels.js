const Channels = ({
  provider,
  account,
  dappcord,
  channels,
  currentChannel,
  setCurrentChannel,
}) => {
  const channelHandler = async (channel) => {
    // Here we check if the user has joined a particular channel or not using hasJoined mapping of th contract
    const hasJoined = await dappcord.hasJoined(channel.id, account);
    if (hasJoined) {
      setCurrentChannel(channel);
    } else {
      // If the use is accessing a channel where he is not a member of he will hae to mint nft to access that channel.

      // We the the signing key or the account address of the user using provider.getSigner
      const signer = await provider.getSigner();

      // We then connect the account to the contract and run the mint() of the contract
      const txn = await dappcord
        .connect(signer)
        .mint(channel.id, { value: channel.cost });
      await txn.wait();
      setCurrentChannel(channel);
    }
  };

  return (
    <div className="channels">
      <div className="channels__text">
        <h2>Text Channels</h2>

        <ul>
          {channels.map((channel, index) => (
            <li
              className={
                currentChannel &&
                currentChannel.id.toString() === channel.id.toString()
                  ? "active"
                  : ""
              }
              onClick={() => channelHandler(channel)}
              key={index}
            >
              {channel.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="channels__voice">
        <h2>Voice Channels</h2>

        <ul>
          <li>Channel 1</li>
          <li>Channel 2</li>
          <li>Channel 3</li>
        </ul>
      </div>
    </div>
  );
};

export default Channels;

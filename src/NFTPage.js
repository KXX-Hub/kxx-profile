import React, { useState } from 'react';

const NFTPage = () => {
  const [mintAmount, setMintAmount] = useState(1);
  const [status, setStatus] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');

  // Replace with your deployed contract address
  const CONTRACT_ADDRESS = "0x3B626B56A96AD21F71e13306eAc2722C29a4014d";

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        setIsConnected(true);
        setStatus('Wallet connected!');
      } catch (error) {
        setStatus('Error connecting wallet: ' + error.message);
      }
    } else {
      setStatus('Please install MetaMask!');
    }
  };

  const mintNFT = async () => {
    if (!isConnected) {
      setStatus('Please connect your wallet first');
      return;
    }

    try {
      setStatus('Initiating minting process...');
      // The price is 0.01 ETH per NFT
      const priceInWei = '10000000000000000' * mintAmount;

      // Create the transaction
      const transaction = {
        from: account,
        to: CONTRACT_ADDRESS,
        value: priceInWei.toString(),
        data: '0x6a627842' // This is the function signature for mint(uint256)
      };

      // Send the transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      });

      setStatus(`Minting in progress! Transaction hash: ${txHash}`);
    } catch (error) {
      setStatus('Error minting NFT: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-4xl text-white font-bold mb-8">KXX Music NFT Collection</h1>

      <div className="mb-8">
        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="text-white">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        )}
      </div>

      {isConnected && (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setMintAmount(prev => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span className="text-xl text-white">{mintAmount}</span>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setMintAmount(prev => Math.min(5, prev + 1))}
            >
              +
            </button>
          </div>

          <button
            className="px-8 py-3 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={mintNFT}
          >
            Mint NFT ({0.01 * mintAmount} ETH)
          </button>
        </div>
      )}

      {status && (
        <div className="mt-4 text-white text-center">
          {status}
        </div>
      )}

      <div className="mt-12 space-y-6 text-white max-w-md">
        <div>
          <h2 className="text-2xl font-bold mb-4">About This Collection</h2>
          <p>
            Welcome to my exclusive music NFT collection. Each NFT represents a unique
            piece from my original music compositions, bridging the gap between
            traditional music production and Web3 technology.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Collection Details</h2>
          <ul className="list-disc pl-6">
            <li>Total Supply: 1000 NFTs</li>
            <li>Price per NFT: 0.01 ETH</li>
            <li>Max Mint per Transaction: 5</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NFTPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import NFTPreviewGrid from './components/NFTPreviewGrid';

const NFTPage = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const isWrongNetwork = chain?.id !== sepolia.id;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Music NFT Collection</h1>
          <ConnectButton />
        </div>

        {isConnected && isWrongNetwork && (
          <div className="text-yellow-400 mb-4">
            <button
              onClick={() => switchNetwork?.(sepolia.id)}
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
            >
              Switch to Sepolia Network
            </button>
          </div>
        )}
      </div>

      {/* NFT Preview Grid */}
      {isConnected && !isWrongNetwork && (
        <NFTPreviewGrid />
      )}

      {/* About Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">About This Collection</h2>
          <p className="mb-4">
            This is my personal music NFT collection featuring original compositions.
            Each NFT represents a unique piece of music that I've created,
            combining my passion for music production and blockchain technology.
          </p>
          <p className="text-gray-400">
            Currently running on Sepolia testnet for development purposes.
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-8 text-center">
        <Link to="/" className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NFTPage;

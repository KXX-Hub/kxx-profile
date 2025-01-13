// src/NFTPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NFTPreviewGrid from './components/NFTPreviewGrid';
import { ethers } from 'ethers';
import './NFTPage.css';

const NFTPage = () => {
  const [account, setAccount] = useState('');
  const [nfts, setNfts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedNft, setSelectedNft] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask to continue');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      setAccount(accounts[0]);

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io']
            }]
          });
        }
      }

      loadNFTs(accounts[0]);

    } catch (err) {
      setError(err.message);
    }
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractABI = [
      "function totalSupply() view returns (uint256)",
      "function getMusicByTokenId(uint256) view returns (tuple(string name, string uri, uint256 minPrice, bool isForSale, address creator))",
      "function purchaseMusic(uint256 tokenId) public payable",
      "event MusicPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price)"
    ];
    return new ethers.Contract(
      "0x3B626B56A96AD21F71e13306eAc2722C29a4014d", // Replace with your contract address
      contractABI,
      signer
    );
  };

  const loadNFTs = async (address) => {
    try {
      const contract = getContract();
      const totalSupply = await contract.totalSupply();
      const nftData = [];

      for (let i = 1; i <= totalSupply; i++) {
        const music = await contract.getMusicByTokenId(i);
        nftData.push({
          id: i,
          name: music.name,
          uri: music.uri,
          minPrice: music.minPrice.toString(),
          isForSale: music.isForSale,
          creator: music.creator
        });
      }

      setNfts(nftData);
      if (nftData.length > 0) {
        setSelectedNft(nftData[0]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePurchase = async (tokenId, priceInWei) => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const contract = getContract();
      const tx = await contract.purchaseMusic(tokenId, {
        value: priceInWei
      });

      alert('Transaction submitted. Please wait for confirmation...');
      await tx.wait();
      alert(`NFT #${tokenId} has been purchased successfully!`);

      // Reload NFTs to update the UI
      await loadNFTs(account);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          loadNFTs(accounts[0]);
        } else {
          setAccount('');
          setNfts([]);
        }
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <div className="nft-page">
      <div className="nft-header">
        <h1 className="nft-title">Music NFT Gallery</h1>
        <div className="wallet-area">
          {!account ? (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="connect-button"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="wallet-display">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
          <Link to="/" className="back-home-btn">Back to Home</Link>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="nft-content">
        <div className="nft-list">
          <h2 className="nft-list-title">Available NFTs</h2>
          <div className={`nft-items ${loading ? 'loading' : ''}`}>
            {nfts.map((nft) => (
              <div
                key={nft.id}
                onClick={() => setSelectedNft(nft)}
                className={`nft-item ${selectedNft?.id === nft.id ? 'selected' : ''}`}
              >
                <h3>{nft.name}</h3>
                <p>Token ID: {nft.id}</p>
                <p>Min Price: {ethers.utils.formatEther(nft.minPrice)} ETH</p>
              </div>
            ))}
            {nfts.length === 0 && (
              <div className="empty-state">
                <p>No NFTs available. Please connect your wallet to view NFTs.</p>
              </div>
            )}
          </div>
        </div>

        <div className="preview-section">
          <h2 className="preview-title">NFT Preview</h2>
          {selectedNft ? (
            <NFTPreviewGrid
              tokenData={selectedNft}
              onPurchase={handlePurchase}
            />
          ) : (
            <div className="empty-state">
              <p>Select an NFT to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTPage;

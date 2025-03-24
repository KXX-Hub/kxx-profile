import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import NFTPreviewGrid from './components/NFTPreviewGrid';
import './css/NFTPage.css';

const NFTPage = () => {
  const [account, setAccount] = useState('');
  const [nfts, setNfts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedNft, setSelectedNft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [albumInfo, setAlbumInfo] = useState(null);

  // Contract Configuration
  const CONTRACT_CONFIG = {
    address: "0x7B248aD1948148367AA1235c54E0873933C78300",
    abi: [
      "function totalSupply() view returns (uint256)",
      "function tracks(uint256) view returns (string name, string uri, uint256 albumId, uint256 trackNumber, uint256 minPrice, uint256 maxSupply, uint256 currentSupply, bool isForSale, address creator)",
      "function albums(uint256) view returns (string name, string uri, uint256 totalTracks, uint256 maxSupply, uint256 currentSupply, bool exists)",
      "function purchaseTrack(uint256 tokenId) public payable",
      "function getAlbumTracks(uint256 albumId) public view returns (tuple(string name, string uri, uint256 albumId, uint256 trackNumber, uint256 minPrice, uint256 maxSupply, uint256 currentSupply, bool isForSale, address creator)[])",
      "event TrackMinted(uint256 indexed tokenId, uint256 indexed albumId, uint256 trackNumber, string name, address owner)",
      "event TrackPurchased(uint256 indexed tokenId, address buyer, uint256 price)"
    ]
  };

  const getContract = async () => {
    if (!window.ethereum) throw new Error('MetaMask not installed');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, signer);
  };

  const loadNFTs = async (walletAddress) => {
    try {
      setLoading(true);
      const contract = await getContract();

      // Get album info
      const album = await contract.albums(1);
      setAlbumInfo({
        name: album.name,
        totalTracks: album.totalTracks.toString(),
        maxSupply: album.maxSupply.toString(),
        currentSupply: album.currentSupply.toString(),
        uri: album.uri
      });

      // Get tracks info
      const tracks = await contract.getAlbumTracks(1);
      const nftData = tracks.map((track, index) => ({
        id: index + 1,
        name: track.name,
        uri: track.uri,
        minPrice: track.minPrice.toString(),
        isForSale: track.isForSale,
        creator: track.creator,
        albumId: track.albumId.toString(),
        trackNumber: track.trackNumber.toString(),
        maxSupply: track.maxSupply.toString(),
        currentSupply: track.currentSupply.toString()
      }));

      setNfts(nftData);
      if (nftData.length > 0 && !selectedNft) {
        setSelectedNft(nftData[0]);
      }
    } catch (err) {
      setError(`Failed to load NFTs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      setAccount(accounts[0]);
      await loadNFTs(accounts[0]);
    } catch (err) {
      setError(`Wallet connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (tokenId, priceInWei) => {
    if (!account) {
      alert('Please connect wallet first');
      return;
    }

    try {
      setLoading(true);
      const contract = await getContract();

      const tx = await contract.purchaseTrack(tokenId, {
        value: priceInWei,
        gasLimit: 300000
      });

      await tx.wait();
      alert('Purchase successful!');
      await loadNFTs(account);
    } catch (err) {
      alert(`Purchase failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum?.selectedAddress) {
        setAccount(window.ethereum.selectedAddress);
        await loadNFTs(window.ethereum.selectedAddress);
      }
    };

    init();

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

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <div className="nft-page">
      <div className="profile-header">
        <h1>Music NFT Gallery</h1>
        <div className="profile-links">
          <a href="https://github.com/KXX-HUB" target="_blank" rel="noopener noreferrer" className="social-link">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.instagram.com/0xkxx_prod/" target="_blank" rel="noopener noreferrer" className="social-link">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.instagram.com/0x_kxx/" target="_blank" rel="noopener noreferrer" className="social-link">
            <i className="fas fa-music"></i>
          </a>
        </div>
      </div>

      <div className="nft-container">
        {albumInfo && (
          <div className="album-info">
            <h2>{albumInfo.name}</h2>
            <p>Total Tracks: {albumInfo.totalTracks} | Supply: {albumInfo.currentSupply}/{albumInfo.maxSupply}</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="nft-content">
          <div className="nft-list">
            <h2>Available NFTs</h2>
            <div className="nft-items">
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
              {nfts.length === 0 && !loading && (
                <div className="empty-state">
                  No NFTs available. Please connect your wallet to view NFTs.
                </div>
              )}
            </div>
          </div>

          <div className="preview-section">
            <h2>NFT Preview</h2>
            {selectedNft ? (
              <NFTPreviewGrid
                tokenData={selectedNft}
                onPurchase={handlePurchase}
              />
            ) : (
              <div className="empty-state">
                Select a track to preview
              </div>
            )}
          </div>
        </div>

        <div className="wallet-section">
          {account ? (
            <div className="wallet-info">
              <div className="wallet-display">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </div>
              <button
                onClick={async () => {
                  setAccount('');
                  setNfts([]);
                  setSelectedNft(null);
                  setError(null);
                }}
                className="disconnect-button"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="connect-button"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>

        <div className="button-container">
          <Link to="/" className="back-home-btn">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default NFTPage;

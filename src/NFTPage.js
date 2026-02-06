import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FaWallet } from 'react-icons/fa';
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

  // Get read-only contract (no wallet needed)
  const getReadOnlyContract = async () => {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error('Not in browser environment');
      }

      // Try to use user's MetaMask provider first (read-only)
      if (window.ethereum) {
        try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
          // Test connection with a timeout
          const networkPromise = provider.getNetwork();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 5000)
          );
          await Promise.race([networkPromise, timeoutPromise]);
        return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, provider);
        } catch (err) {
          console.log('MetaMask provider failed, trying public providers...', err.message);
        }
      }
      
      // Fallback to public providers
      const providers = [
        'https://eth.llamarpc.com',
        'https://rpc.ankr.com/eth',
        'https://eth-mainnet.public.blastapi.io',
        'https://ethereum.publicnode.com',
        'https://1rpc.io/eth'
      ];
      
      // Try each provider until one works
      for (const rpcUrl of providers) {
        try {
          const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
          // Test connection with timeout
          const networkPromise = provider.getNetwork();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), 5000)
          );
          await Promise.race([networkPromise, timeoutPromise]);
          console.log('Connected to RPC:', rpcUrl);
          return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, provider);
        } catch (err) {
          console.log(`RPC ${rpcUrl} failed:`, err.message);
          continue; // Try next provider
        }
      }
      
      throw new Error('Unable to connect to Ethereum network. Please install MetaMask or try again later.');
    } catch (err) {
      console.error('getReadOnlyContract error:', err);
      throw err;
    }
  };

  // Get contract with signer (wallet needed for transactions)
  const getSignerContract = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Please install MetaMask');
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, signer);
  };

  // Load NFTs without wallet (read-only)
  const loadNFTs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading NFTs...');
      const contract = await getReadOnlyContract();
      console.log('Contract connected');

      // Get album info with timeout
      try {
        const albumPromise = contract.albums(1);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        const album = await Promise.race([albumPromise, timeoutPromise]);
        
      setAlbumInfo({
        name: album.name,
        totalTracks: album.totalTracks.toString(),
        maxSupply: album.maxSupply.toString(),
        currentSupply: album.currentSupply.toString(),
        uri: album.uri
      });
        console.log('Album info loaded:', album.name);
      } catch (err) {
        console.error('Failed to load album info:', err);
        throw new Error(`Failed to load album: ${err.message}`);
      }

      // Get tracks info with timeout
      try {
        const tracksPromise = contract.getAlbumTracks(1);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        );
        const tracks = await Promise.race([tracksPromise, timeoutPromise]);
        
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

        console.log('Loaded', nftData.length, 'tracks');
      setNfts(nftData);
      if (nftData.length > 0 && !selectedNft) {
        setSelectedNft(nftData[0]);
      }
    } catch (err) {
        console.error('Failed to load tracks:', err);
        throw new Error(`Failed to load tracks: ${err.message}`);
      }
    } catch (err) {
      console.error('loadNFTs error:', err);
      setError(`Failed to load NFTs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Connect wallet (only when user wants to purchase)
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts && accounts.length > 0) {
      setAccount(accounts[0]);
      return accounts[0];
      } else {
        throw new Error('No accounts found');
      }
    } catch (err) {
      setError(`Wallet connection failed: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle purchase - connect wallet if not connected
  const handlePurchase = async (tokenId, priceInWei) => {
    try {
      setLoading(true);
      
      // Connect wallet if not connected
      let walletAddress = account;
      if (!walletAddress) {
        walletAddress = await connectWallet();
      }

      const contract = await getSignerContract();

      const tx = await contract.purchaseTrack(tokenId, {
        value: priceInWei,
        gasLimit: 300000
      });

      await tx.wait();
      alert('Purchase successful!');
      
      // Reload NFT data
      await loadNFTs();
    } catch (err) {
      alert(`Purchase failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load NFTs on page load (no wallet required)
  useEffect(() => {
    // Add error boundary for deployment
    const initNFTs = async () => {
      try {
        await loadNFTs();
      } catch (err) {
        console.error('Failed to initialize NFTs:', err);
        setError(`Failed to initialize: ${err.message}`);
      }
    };
    
    initNFTs();

    // Listen for wallet changes (only in browser environment)
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        })
        .catch(err => {
          console.warn('Failed to check accounts:', err);
        });

    return () => {
      if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
    }
  }, []);

  return (
    <div className="nft-page">
      {/* Wallet button in top right corner */}
      <div className="wallet-corner">
        {account ? (
          <div className="wallet-info-corner">
            <div className="wallet-display-corner">
              <FaWallet style={{ marginRight: '0.5rem' }} />
              {`${account.slice(0, 6)}...${account.slice(-4)}`}
            </div>
            <button
              onClick={() => {
                setAccount('');
              }}
              className="disconnect-button-corner"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="connect-button-corner"
          >
            <FaWallet style={{ marginRight: '0.5rem' }} />
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>

      <div className="profile-header">
        <h1>Music NFT Gallery</h1>
        <p className="subtitle">Listen to music and collect NFTs on the blockchain</p>
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


        {loading && !nfts.length && (
          <div className="loading-state">
            Loading NFTs...
          </div>
        )}

        <div className="nft-content">
          <div className="nft-list">
            <h2>Available Tracks</h2>
            <div className="nft-items">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  onClick={() => setSelectedNft(nft)}
                  className={`nft-item ${selectedNft?.id === nft.id ? 'selected' : ''}`}
                >
                  <h3>{nft.name}</h3>
                  <p>Track #{nft.trackNumber}</p>
                  <p>Price: {ethers.utils.formatEther(nft.minPrice)} ETH</p>
                </div>
              ))}
              {nfts.length === 0 && !loading && (
                <div className="empty-state">
                  No tracks available at the moment.
                </div>
              )}
            </div>
          </div>

          <div className="preview-section">
            <h2>Track Preview</h2>
            {selectedNft ? (
              <NFTPreviewGrid
                tokenData={selectedNft}
                onPurchase={handlePurchase}
                isConnected={!!account}
              />
            ) : (
              <div className="empty-state">
                Select a track to preview and listen
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NFTPage;

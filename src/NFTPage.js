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
      "function tokenURI(uint256 tokenId) view returns (string)",
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

      const withTimeout = (promise, timeoutMs) => {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), timeoutMs)
        );
        return Promise.race([promise, timeoutPromise]);
      };

      const hasContractCode = async (provider) => {
        try {
          const code = await withTimeout(provider.getCode(CONTRACT_CONFIG.address), 6000);
          return code && code !== '0x';
        } catch {
          return false;
        }
      };

      // Try to use user's MetaMask provider first (read-only)
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await withTimeout(provider.getNetwork(), 5000);
          if (await hasContractCode(provider)) {
            return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, provider);
          }
          console.log('MetaMask network does not have contract, trying public providers...');
        } catch (err) {
          console.log('MetaMask provider failed, trying public providers...', err.message);
        }
      }

      // Force Sepolia (user confirmed network)
      const sepoliaProviders = [
        'https://rpc.sepolia.org',
        'https://eth-sepolia.public.blastapi.io',
        'https://sepolia.drpc.org',
        'https://sepolia.gateway.tenderly.co',
        'https://rpc2.sepolia.org'
      ];

      // Try default provider (may work without API keys)
      try {
        const defaultProvider = ethers.getDefaultProvider('sepolia');
        await withTimeout(defaultProvider.getNetwork(), 5000);
        if (await hasContractCode(defaultProvider)) {
          console.log('Connected to default Sepolia provider');
          return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, defaultProvider);
        }
      } catch (err) {
        console.log('Default Sepolia provider failed:', err.message);
      }

      for (const rpcUrl of sepoliaProviders) {
        try {
          const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
          await withTimeout(provider.getNetwork(), 5000);
          const hasCode = await hasContractCode(provider);
          if (hasCode) {
            console.log('Connected to Sepolia RPC:', rpcUrl);
            return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, provider);
          }
        } catch (err) {
          console.log(`Sepolia RPC ${rpcUrl} failed:`, err.message);
        }
      }

      throw new Error('Unable to find contract on Sepolia RPCs. Please install MetaMask or try again later.');
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

      const withTimeout = (promise, timeoutMs) => {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
        );
        return Promise.race([promise, timeoutPromise]);
      };

      const tryAlbumId = async (albumId) => {
        const album = await withTimeout(contract.albums(albumId), 10000);
        if (!album || !album.exists) {
          throw new Error('Album not found');
        }
        return album;
      };

      // Get album info with timeout (non-blocking)
      try {
        let album;
        try {
          album = await tryAlbumId(1);
        } catch {
          album = await tryAlbumId(0);
        }

        setAlbumInfo({
          name: album.name,
          totalTracks: album.totalTracks.toString(),
          maxSupply: album.maxSupply.toString(),
          currentSupply: album.currentSupply.toString(),
          uri: album.uri
        });
        console.log('Album info loaded:', album.name);
      } catch (err) {
        console.warn('Album info unavailable, continuing in read-only mode:', err.message);
        setAlbumInfo(null);
      }

      // Get tracks info with timeout
      try {
        let tracks;
        try {
          tracks = await withTimeout(contract.getAlbumTracks(1), 15000);
        } catch {
          tracks = await withTimeout(contract.getAlbumTracks(0), 15000);
        }

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
        console.warn('getAlbumTracks failed, trying totalSupply/tokenURI fallback:', err.message);
        try {
          const totalSupply = await withTimeout(contract.totalSupply(), 8000);
          const count = Number(totalSupply?.toString?.() ?? 0);
          if (!Number.isFinite(count) || count <= 0) {
            setNfts([]);
          } else {
            const tryTokenIds = async (startAtZero) => {
              const tokenIds = Array.from({ length: count }, (_, i) => (startAtZero ? i : i + 1));
              const uriResults = await Promise.all(
                tokenIds.map(async (tokenId) => {
                  try {
                    const uri = await withTimeout(contract.tokenURI(tokenId), 8000);
                    return { tokenId, uri };
                  } catch {
                    return { tokenId, uri: null };
                  }
                })
              );
              return uriResults.filter(item => item.uri);
            };

            let uriResults = await tryTokenIds(false);
            if (!uriResults.length) {
              uriResults = await tryTokenIds(true);
            }

            const nftData = uriResults.map((item) => ({
              id: item.tokenId,
              name: `Track #${item.tokenId}`,
              uri: item.uri,
              minPrice: '0',
              isForSale: false,
              creator: '',
              albumId: '0',
              trackNumber: String(item.tokenId),
              maxSupply: '0',
              currentSupply: '0'
            }));

            setNfts(nftData);
            if (nftData.length > 0 && !selectedNft) {
              setSelectedNft(nftData[0]);
            }
          }
        } catch (fallbackErr) {
          console.warn('Fallback tokenURI failed:', fallbackErr.message);
          setNfts([]);
        }
      }
    } catch (err) {
      console.error('loadNFTs error:', err);
      setError(null);
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
        setError(null);
        return null;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts && accounts.length > 0) {
      setAccount(accounts[0]);
      return accounts[0];
      } else {
        setError(null);
        return null;
      }
    } catch (err) {
      setError(null);
      return null;
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
        if (!walletAddress) return;
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
            disabled={loading || typeof window === 'undefined' || !window.ethereum}
            className="connect-button-corner"
          >
            <FaWallet style={{ marginRight: '0.5rem' }} />
            {loading ? 'Connecting...' : (typeof window === 'undefined' || !window.ethereum ? 'Wallet Unavailable' : 'Connect Wallet')}
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

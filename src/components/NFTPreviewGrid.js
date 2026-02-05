import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import '../css/NFTPreviewGrid.css';

// Multiple IPFS gateways to try
const IPFS_GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://dweb.link/ipfs/'
];

const NFTPreviewGrid = ({ tokenData, onPurchase, isConnected }) => {
  const [metadata, setMetadata] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('https://placehold.co/400x400/2B2520/C9C0B0?text=Loading...');
  const [customPrice, setCustomPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [audioKey, setAudioKey] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Try to fetch from multiple gateways
  const fetchFromIPFS = async (hash) => {
    for (const gateway of IPFS_GATEWAYS) {
      try {
        const response = await fetch(`${gateway}${hash}`, { 
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        if (response.ok) {
          return response;
        }
      } catch (err) {
        console.log(`Gateway ${gateway} failed, trying next...`);
      }
    }
    throw new Error('All gateways failed');
  };

  useEffect(() => {
    const loadMetadata = async () => {
      setAudioUrl('');
      setAudioKey(prev => prev + 1);
      setImageUrl('https://placehold.co/400x400/2B2520/C9C0B0?text=Loading...');
      setImageError(false);

      if (!tokenData?.uri) return;

      try {
        const ipfsHash = tokenData.uri.replace('ipfs://', '');
        const response = await fetchFromIPFS(ipfsHash);
        const data = await response.json();
        setMetadata(data);

        // Update audio URL (use first gateway that works for metadata)
        if (data.animation_url) {
          const audioHash = data.animation_url.replace('ipfs://', '');
          setAudioUrl(`${IPFS_GATEWAYS[0]}${audioHash}`);
        }

        // Update image URL
        if (data.image) {
          const imageHash = data.image.replace('ipfs://', '');
          setImageUrl(`${IPFS_GATEWAYS[0]}${imageHash}`);
        }
      } catch (err) {
        console.error('Error loading metadata:', err);
        setImageUrl('https://placehold.co/400x400/2B2520/C9C0B0?text=Failed+to+load');
      }
    };

    loadMetadata();
    // Reset price input
    setCustomPrice(ethers.utils.formatEther(tokenData?.minPrice || '0'));
  }, [tokenData]);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setCustomPrice(value);

    if (!value) {
      setPriceError('Please enter a price');
      return;
    }

    try {
      const priceInWei = ethers.utils.parseEther(value);
      const minPriceInWei = ethers.BigNumber.from(tokenData.minPrice);

      if (priceInWei.lt(minPriceInWei)) {
        setPriceError(`Price must be at least ${ethers.utils.formatEther(minPriceInWei)} ETH`);
      } else {
        setPriceError('');
      }
    } catch (err) {
      setPriceError('Please enter a valid price');
    }
  };

  const handlePurchase = () => {
    try {
      const priceInWei = ethers.utils.parseEther(customPrice);
      onPurchase(tokenData.id, priceInWei);
    } catch (err) {
      setPriceError('Invalid price format');
    }
  };

  return (
    <div className="nft-preview-grid">
      <div className="preview-image-container">
        <img 
          src={imageUrl} 
          alt="NFT Preview" 
          className="preview-image"
          onError={(e) => {
            // Try next gateway on error
            if (!imageError && metadata?.image) {
              setImageError(true);
              const imageHash = metadata.image.replace('ipfs://', '');
              // Try cloudflare gateway as backup
              e.target.src = `https://cloudflare-ipfs.com/ipfs/${imageHash}`;
            } else {
              e.target.src = 'https://placehold.co/400x400/2B2520/C9C0B0?text=Image+Not+Found';
            }
          }}
        />
      </div>

      {audioUrl && (
        <div className="audio-section">
          <h4>Preview Track</h4>
          <audio
            key={audioKey} // Use key to force re-render
            controls
            className="preview-audio"
            controlsList="nodownload"
          >
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="metadata-section">
        <h3>{tokenData.name}</h3>
        <div className="metadata-grid">
          <div className="metadata-item">
            <span className="label">Track Number</span>
            <span className="value">{tokenData.trackNumber}</span>
          </div>
          <div className="metadata-item">
            <span className="label">Min Price</span>
            <span className="value">{ethers.utils.formatEther(tokenData.minPrice)} ETH</span>
          </div>
          {tokenData.isForSale && (
            <div className="metadata-item">
              <span className="label">Your Offer</span>
              <input
                type="number"
                value={customPrice}
                onChange={handlePriceChange}
                placeholder="Enter price in ETH"
                step="0.001"
                min={ethers.utils.formatEther(tokenData.minPrice)}
                className="price-input"
              />
            </div>
          )}
          <div className="metadata-item">
            <span className="label">Status</span>
            <span className={`value status ${tokenData.isForSale ? 'for-sale' : 'not-for-sale'}`}>
              {tokenData.isForSale ? '🟢 For Sale' : '🔴 Not for Sale'}
            </span>
          </div>
        </div>
        {priceError && <p className="error-text">{priceError}</p>}
      </div>

      {tokenData.isForSale && (
        <button
          onClick={handlePurchase}
          className="purchase-button"
          disabled={!isConnected && false} // Never disable, just change text
        >
          {isConnected ? 'Purchase NFT' : 'Connect Wallet to Purchase'}
        </button>
      )}
    </div>
  );
};

export default NFTPreviewGrid;

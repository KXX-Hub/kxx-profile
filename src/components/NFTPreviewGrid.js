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
  const [imagePath, setImagePath] = useState('');
  const [imageGatewayIndex, setImageGatewayIndex] = useState(0);
  const [customPrice, setCustomPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [audioKey, setAudioKey] = useState(0);
  const [imageError, setImageError] = useState(false);

  const normalizeIpfsPath = (uri) => {
    if (!uri) return '';
    if (uri.startsWith('ipfs://')) {
      return uri.replace('ipfs://', '').replace(/^ipfs\//, '');
    }
    return uri;
  };

  const isHttpUrl = (uri) => /^https?:\/\//i.test(uri);

  // Helper to create timeout signal (compatible with older browsers)
  const createTimeoutSignal = (timeoutMs) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    // Clear timeout if request completes
    return { signal: controller.signal, cleanup: () => clearTimeout(timeoutId) };
  };

  // Try to fetch from multiple gateways
  const fetchFromIPFS = async (uriOrHash) => {
    if (!uriOrHash) throw new Error('Missing IPFS URI');
    
    // Try HTTP URL first
    if (isHttpUrl(uriOrHash)) {
      try {
        const { signal, cleanup } = createTimeoutSignal(5000);
        const response = await fetch(uriOrHash, { signal });
        cleanup();
        if (response.ok) {
          return { response, gateway: null };
        }
      } catch (err) {
        console.log('HTTP URL fetch failed:', err.message);
      }
    }

    // Try IPFS gateways
    const hash = normalizeIpfsPath(uriOrHash);
    for (const gateway of IPFS_GATEWAYS) {
      try {
        const { signal, cleanup } = createTimeoutSignal(5000);
        const response = await fetch(`${gateway}${hash}`, { signal });
        cleanup();
        if (response.ok) {
          return { response, gateway };
        }
      } catch (err) {
        console.log(`Gateway ${gateway} failed:`, err.message);
        // Continue to next gateway
      }
    }
    throw new Error('All gateways failed');
  };

  useEffect(() => {
    const loadMetadata = async () => {
      setAudioUrl('');
      setAudioKey(prev => prev + 1);
      setImageUrl('https://placehold.co/400x400/2B2520/C9C0B0?text=Loading...');
      setImagePath('');
      setImageGatewayIndex(0);
      setImageError(false);

      if (!tokenData?.uri) {
        console.warn('No URI provided for token:', tokenData);
        setImageUrl('https://placehold.co/400x400/2B2520/C9C0B0?text=No+URI');
        return;
      }

      try {
        console.log('Loading metadata from:', tokenData.uri);
        const { response, gateway } = await fetchFromIPFS(tokenData.uri);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Metadata loaded:', data);
        setMetadata(data);

        // Update audio URL (use first gateway that works for metadata)
        if (data.animation_url) {
          const audioPath = normalizeIpfsPath(data.animation_url);
          if (isHttpUrl(data.animation_url)) {
            setAudioUrl(data.animation_url);
          } else {
            const audioGateway = gateway || IPFS_GATEWAYS[0];
            setAudioUrl(`${audioGateway}${audioPath}`);
          }
        }

        // Update image URL
        if (data.image) {
          const normalizedPath = normalizeIpfsPath(data.image);
          setImagePath(normalizedPath);
          if (isHttpUrl(data.image)) {
            setImageUrl(data.image);
          } else {
            const imageGateway = gateway || IPFS_GATEWAYS[0];
            const gatewayIndex = IPFS_GATEWAYS.indexOf(imageGateway);
            setImageGatewayIndex(gatewayIndex >= 0 ? gatewayIndex : 0);
            setImageUrl(`${imageGateway}${normalizedPath}`);
          }
        } else {
          console.warn('No image in metadata');
          setImageUrl('https://placehold.co/400x400/2B2520/C9C0B0?text=No+Image');
        }
      } catch (err) {
        console.error('Error loading metadata:', err);
        setImageUrl('https://placehold.co/400x400/2B2520/C9C0B0?text=Failed+to+load');
        setMetadata(null);
      }
    };

    loadMetadata();
    // Reset price input
    try {
      if (tokenData?.minPrice) {
        setCustomPrice(ethers.utils.formatEther(tokenData.minPrice));
      } else {
        setCustomPrice('0');
      }
    } catch (err) {
      console.error('Error formatting price:', err);
      setCustomPrice('0');
    }
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
            if (!imagePath || isHttpUrl(metadata?.image || '')) {
              e.target.src = 'https://placehold.co/400x400/2B2520/C9C0B0?text=Image+Not+Found';
              return;
            }

            const nextIndex = imageGatewayIndex + 1;
            if (nextIndex < IPFS_GATEWAYS.length) {
              setImageError(true);
              setImageGatewayIndex(nextIndex);
              e.target.src = `${IPFS_GATEWAYS[nextIndex]}${imagePath}`;
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
          onClick={isConnected ? handlePurchase : undefined}
          className="purchase-button"
          disabled={!isConnected}
          title={!isConnected ? 'Connect wallet to purchase' : ''}
        >
          {isConnected ? 'Purchase NFT' : 'Connect Wallet to Purchase'}
        </button>
      )}
    </div>
  );
};

export default NFTPreviewGrid;

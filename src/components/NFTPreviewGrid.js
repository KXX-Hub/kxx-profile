// src/components/NFTPreviewGrid.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './NFTPreviewGrid.css';

const NFTPreviewGrid = ({ tokenData, onPurchase }) => {
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('/api/placeholder/400/400');
  const [error, setError] = useState(null);
  const [price, setPrice] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenData?.uri) return;

      setIsLoading(true);
      try {
        const cid = tokenData.uri.replace('ipfs://', '');
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
        const data = await response.json();
        setMetadata(data);

        if (data.animation_url) {
          const audioCid = data.animation_url.replace('ipfs://', '');
          setAudioUrl(`https://gateway.pinata.cloud/ipfs/${audioCid}`);
        }

        if (data.image) {
          const imageCid = data.image.replace('ipfs://', '');
          setImageUrl(`https://gateway.pinata.cloud/ipfs/${imageCid}`);
        }
      } catch (err) {
        setError('Failed to load NFT metadata');
        console.error('Error fetching metadata:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [tokenData]);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value);

    if (!value) {
      setValidationError('Please enter a price');
      return;
    }

    try {
      const priceInWei = ethers.utils.parseEther(value);
      const minPriceInWei = ethers.BigNumber.from(tokenData.minPrice);

      if (priceInWei.lt(minPriceInWei)) {
        setValidationError(`Price must be at least ${ethers.utils.formatEther(minPriceInWei)} ETH`);
      } else {
        setValidationError('');
      }
    } catch (err) {
      setValidationError('Please enter a valid price in ETH');
    }
  };

  const handlePurchaseClick = () => {
    if (!price) {
      setValidationError('Please enter a price');
      return;
    }

    try {
      const priceInWei = ethers.utils.parseEther(price);
      onPurchase(tokenData.id, priceInWei);
    } catch (err) {
      setValidationError('Invalid price format');
    }
  };

  if (error) {
    return (
      <div className="nft-preview-grid error">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="nft-preview-grid loading">
        <div className="loading-message">
          <p>Loading NFT metadata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nft-preview-grid">
      <div className="preview-image-container">
        <img
          src={imageUrl}
          alt={metadata?.name || "NFT Preview"}
          className="preview-image"
        />
      </div>

      {metadata && (
        <div className="metadata-section">
          <h3>{metadata.name}</h3>
          {metadata.description && (
            <p className="description">{metadata.description}</p>
          )}
        </div>
      )}

      {audioUrl && (
        <div className="audio-section">
          <h4>Preview Track</h4>
          <audio controls className="preview-audio">
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="purchase-section">
        <label className="price-label">
          Purchase Price (ETH)
          <input
            type="number"
            placeholder="Enter price in ETH"
            value={price}
            onChange={handlePriceChange}
            step="0.000000000000000001"
            min={ethers.utils.formatEther(tokenData?.minPrice || '0')}
            className="price-input"
          />
        </label>

        {validationError && (
          <p className="validation-error">{validationError}</p>
        )}

        <button
          onClick={handlePurchaseClick}
          disabled={!!validationError || !price}
          className="purchase-button"
        >
          Purchase NFT
        </button>
      </div>

      <div className="nft-info">
        <h4>NFT Details</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="label">Token ID:</span>
            <span className="value">{tokenData?.id || 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="label">Min Price:</span>
            <span className="value">
              {tokenData?.minPrice ? `${ethers.utils.formatEther(tokenData.minPrice)} ETH` : 'N/A'}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Creator:</span>
            <span className="value">
              {tokenData?.creator ? `${tokenData.creator.slice(0, 6)}...${tokenData.creator.slice(-4)}` : 'N/A'}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Status:</span>
            <span className={`value status ${tokenData?.isForSale ? 'for-sale' : 'not-for-sale'}`}>
              {tokenData?.isForSale ? '🟢 For Sale' : '🔴 Not for Sale'}
            </span>
          </div>
          {metadata?.attributes && (
            <div className="attributes-section">
              <h4>Attributes</h4>
              <div className="attributes-grid">
                {metadata.attributes.map((attr, index) => (
                  <div key={index} className="attribute-item">
                    <span className="attribute-label">{attr.trait_type}:</span>
                    <span className="attribute-value">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTPreviewGrid;

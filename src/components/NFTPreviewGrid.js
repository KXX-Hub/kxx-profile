import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import '../css/NFTPreviewGrid.css';

const NFTPreviewGrid = ({ tokenData, onPurchase }) => {
  const [metadata, setMetadata] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('/api/placeholder/400/400');
  const [customPrice, setCustomPrice] = useState('');
  const [priceError, setPriceError] = useState('');
  const [audioKey, setAudioKey] = useState(0); // 添加 key 来强制重新渲染音频元素

  useEffect(() => {
    const loadMetadata = async () => {
      // 重置音频URL和状态
      setAudioUrl('');
      setAudioKey(prev => prev + 1);
      setImageUrl('/api/placeholder/400/400');

      if (!tokenData?.uri) return;

      try {
        const ipfsHash = tokenData.uri.replace('ipfs://', '');
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
        const data = await response.json();
        setMetadata(data);

        // 更新音频URL
        if (data.animation_url) {
          const audioHash = data.animation_url.replace('ipfs://', '');
          const newAudioUrl = `https://gateway.pinata.cloud/ipfs/${audioHash}`;
          setAudioUrl(newAudioUrl);
        }

        // 更新图片URL
        if (data.image) {
          const imageHash = data.image.replace('ipfs://', '');
          setImageUrl(`https://gateway.pinata.cloud/ipfs/${imageHash}`);
        }
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    };

    loadMetadata();
    // 重置价格输入
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
        <img src={imageUrl} alt="NFT Preview" className="preview-image" />
      </div>

      {audioUrl && (
        <div className="audio-section">
          <h4>Preview Track</h4>
          <audio
            key={audioKey} // 使用 key 来强制重新渲染
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
          disabled={!!priceError || !customPrice}
        >
          Purchase NFT
        </button>
      )}
    </div>
  );
};

export default NFTPreviewGrid;

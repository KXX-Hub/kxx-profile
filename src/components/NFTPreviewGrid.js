import React, { useState, useEffect } from 'react';

const NFTMedia = ({ tokenId, metadata }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    // 处理音频元素
    if (metadata?.animation_url) {
      const audio = new Audio(metadata.animation_url);
      audio.volume = volume;
      setAudioElement(audio);
    }

    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [metadata]);

  const togglePlay = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioElement) {
      audioElement.volume = newVolume;
    }
  };

  return (
    <div className="space-y-4">
      {/* NFT Image */}
      <div className="relative w-full h-48 bg-gray-700 rounded-lg overflow-hidden">
        {metadata?.image ? (
          <img
            src={metadata.image}
            alt={metadata.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl text-gray-500">♫</div>
          </div>
        )}
      </div>

      {/* Audio Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
          disabled={!metadata?.animation_url}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleVolumeChange(volume === 0 ? 1 : 0)}
            className="p-1 hover:bg-gray-700 rounded-full"
          >
            {volume === 0 ? "🔇" : "🔊"}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-1 bg-gray-600 rounded-full"
          />
        </div>
      </div>

      {metadata && (
        <div className="text-white">
          <h3 className="font-bold">{metadata.name}</h3>
          <p className="text-sm text-gray-400">{metadata.description}</p>
        </div>
      )}
    </div>
  );
};

const NFTCard = ({
                   tokenId,
                   price,
                   phase,
                   releaseDate,
                   mintLimit,
                   totalMinted,
                   isAvailable,
                   metadata
                 }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col space-y-4">
      <NFTMedia
        tokenId={tokenId}
        metadata={metadata}
      />

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Supply: {mintLimit}</span>
          <span>Minted: {totalMinted}</span>
        </div>

        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${(totalMinted / mintLimit) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-white font-bold">{price} ETH</span>
        <button
          className={`
            px-4 py-2 rounded-lg font-bold transition-colors
            ${isAvailable
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
          `}
          disabled={!isAvailable}
        >
          {isAvailable ? 'Mint' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

const NFTPreviewGrid = () => {
  const [currentPhase, setCurrentPhase] = useState(1);

  // NFT 集合示例数据
  const collections = {
    1: [
      {
        tokenId: 1,
        phase: 1,
        price: 0.1,
        releaseDate: "2025-02-01",
        mintLimit: 100,
        totalMinted: 20,
        isAvailable: true,
        metadata: {
          name: "Summer Vibes",
          description: "A chill electronic track perfect for summer days",
          image: "/placeholder-image-1.jpg",
          animation_url: "/placeholder-audio-1.mp3"
        }
      }
    ],
    2: [
      {
        tokenId: 2,
        phase: 2,
        price: 0.15,
        releaseDate: "2025-03-01",
        mintLimit: 50,
        totalMinted: 0,
        isAvailable: false,
        metadata: {
          name: "Midnight Jazz",
          description: "Smooth jazz composition with modern elements",
          image: "/placeholder-image-2.jpg",
          animation_url: "/placeholder-audio-2.mp3"
        }
      }
    ]
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex space-x-4 justify-center">
        {Object.keys(collections).map((phase) => (
          <button
            key={phase}
            onClick={() => setCurrentPhase(Number(phase))}
            className={`
              px-4 py-2 rounded-lg transition-colors
              ${currentPhase === Number(phase)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            `}
          >
            Phase {phase}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections[currentPhase].map((nft) => (
          <NFTCard key={nft.tokenId} {...nft} />
        ))}
      </div>
    </div>
  );
};

export default NFTPreviewGrid;

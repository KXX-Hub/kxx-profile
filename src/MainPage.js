import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import './MainPage.css';

// TypewriterEffect Component
const TypewriterEffect = ({ content }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const contentRef = useRef(content || ''); // 預設為空字串

  useEffect(() => {
    if (!content || typeof content !== 'string') {
      setDisplayedContent('');
      return;
    }

    contentRef.current = content;
    setDisplayedContent('');
    let index = 0;
    let timeoutId;

    const typeNextChar = () => {
      const nextChar = contentRef.current[index];
      if (index < contentRef.current.length && typeof nextChar === 'string') {
        setDisplayedContent((prev) => prev + nextChar);
        index++;
        timeoutId = setTimeout(typeNextChar, 20);
      }
    };

    typeNextChar();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [content]);

  return <pre className="project-text">{displayedContent}</pre>;
};

// Box Component
const Box = ({ title, content, path }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="box-wrapper">
      <Link to={path} className="box" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <h3 className="box-title">{title}</h3>
      </Link>
      <div className={`content-box ${isHovered ? 'visible' : ''}`}>
        {isHovered && content && <TypewriterEffect key={title} content={content} />}
      </div>
    </div>
  );
};


const MainPage = () => {
  const codingContent = `
Projects:
  - Remote Telemedicine consult system
  - Ethereum wallet tracker
  - Zimbra auto mail bot
  - Auto API check bot
  - Gas line notify
  - NFT
  - Solidity & smart contract`;

  const meContent = `
About Me:
  - Software Developer
  - Cybersecurity Engineer Intern
  - IEEE author`;

  const nftContent = `
NFT Collection:
  - Original Music NFTs
  - Exclusive Digital Art
  - Limited Edition Releases
  - Smart Contract Integration`;

  return (
    <div className="main-page">
      <header className="header">
        <h1 className="title">GM! I'm Kai.</h1>
        <h2 className="subtitle">Welcome to my digital gallery.</h2>
      </header>
      <main>
        <div className="box-container">
          <Box title="Coding" content={codingContent} path="/coding" />
          <Box title="Me" content={meContent} path="/me" />
          <Box title="NFT" content={nftContent} path="/nft" />
        </div>
      </main>
    </div>
  );
};

export default MainPage;

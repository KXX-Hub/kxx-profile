import React, { useState, useEffect, useRef } from 'react';
import './MainPage.css';

// TypewriterEffect Component
const TypewriterEffect = ({ content }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const contentRef = useRef(content || ''); // 預設為空字串

  useEffect(() => {
    // 如果 content 無效或不是字串，直接返回空
    if (!content || typeof content !== 'string') {
      setDisplayedContent('');
      return;
    }

    contentRef.current = content;
    setDisplayedContent(''); // 每次重新開始打字效果
    let index = 0;
    let timeoutId;

    const typeNextChar = () => {
      // 確保每個字元有效，避免拼接 undefined 或其他異常值
      const nextChar = contentRef.current[index];
      if (index < contentRef.current.length && typeof nextChar === 'string') {
        setDisplayedContent((prev) => prev + nextChar);
        index++;
        timeoutId = setTimeout(typeNextChar, 20); // 控制打字速度
      }
    };

    typeNextChar();

    return () => {
      clearTimeout(timeoutId); // 清除計時器
    };
  }, [content]);

  return <pre className="project-text">{displayedContent}</pre>;
};


// Box Component
const Box = ({ title, content }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="box-wrapper">
      <div
        className="box"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3 className="box-title">{title}</h3>
      </div>
      <div className={`content-box ${isHovered ? 'visible' : ''}`}>
        {isHovered && content && <TypewriterEffect key={title} content={content} />}
      </div>
    </div>
  );
};

// MainPage Component
const MainPage = () => {
  const [currentPage, setCurrentPage] = useState(null);

  // Content for each box
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

  const producingContent = `
     Production:
    - Music Album: KXX | XXXXXX
    - Total Song : 3
     Experience : 5 years:
    - Music Producer
    - Piano Teachers
    - Composer`;

  const renderPage = () => {
    switch (currentPage) {
      case 'Coding':
      case 'Me':
      case 'Producing':
        return (
          <div>
            <button className="back-button" onClick={() => setCurrentPage(null)}>Back</button>
            <div className="box-container">
              <Box
                title={currentPage}
                content={
                  currentPage === 'Coding' ? codingContent :
                    currentPage === 'Me' ? meContent :
                      producingContent
                }
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="box-container">
            <Box title="Coding" content={codingContent} />
            <Box title="Me" content={meContent} />
            <Box title="Producing" content={producingContent} />
          </div>
        );
    }
  };

  return (
    <div className="main-page">
      <header className="header">
        <h1 className="title">GM! I'm Kai.</h1>
        <h2 className="subtitle">Welcome to my digital gallery.</h2>
      </header>
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default MainPage;

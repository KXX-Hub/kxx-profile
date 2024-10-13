import React, { useState, useEffect, useRef } from 'react';
import './MainPage.css';

const TypewriterEffect = ({ content }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
    setDisplayedContent('');
    let index = 0;

    const typeNextChar = () => {
      if (index < contentRef.current.length) {
        setDisplayedContent(prev => prev + contentRef.current[index]);
        index++;
        setTimeout(typeNextChar, 20);
      }
    };

    typeNextChar();

    return () => {
      index = contentRef.current.length; // Stops the typing effect immediately
    };
  }, [content]);

  return <pre className="project-text">{displayedContent}</pre>;
};

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
        {isHovered && <TypewriterEffect key={title} content={content} />}
      </div>
    </div>
  );
};

const MainPage = () => {
  const [currentPage, setCurrentPage] = useState(null);

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
- piano teachers
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

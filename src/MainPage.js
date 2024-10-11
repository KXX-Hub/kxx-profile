import React, { useState, useEffect, useRef } from 'react';

const styles = {
  mainPage: {
    backgroundColor: '#808080',
    color: 'white',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'monospace',
    fontSize: '16px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.5rem',
  },
  boxContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  boxWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '0 20px',
    height: '450px',
  },
  box: {
    backgroundColor: 'white',
    color: 'black',
    width: '200px',
    height: '200px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  boxTitle: {
    fontSize: '1.3rem',
  },
  contentBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '1rem',
    width: '350px', // Increased width to accommodate longer lines
    height: '220px',
    overflow: 'auto',
    transition: 'opacity 0.3s ease',
    opacity: 0,
    visibility: 'hidden',
  },
  contentBoxVisible: {
    opacity: 1,
    visibility: 'visible',
  },
  projectText: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: 0,
    fontSize: '0.9rem',
    lineHeight: '1.6',
  },
  backButton: {
    marginBottom: '20px',
    fontSize: '1rem',
    padding: '10px 20px',
  },
};

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

  console.log('Displayed content:', displayedContent);
  console.log('Original content:', content);

  return <pre style={styles.projectText}>{displayedContent}</pre>;
};

const Box = ({ title, content }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.boxWrapper}>
      <div 
        style={styles.box} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3 style={styles.boxTitle}>{title}</h3>
      </div>
      <div style={{
        ...styles.contentBox,
        ...(isHovered ? styles.contentBoxVisible : {})
      }}>
        {isHovered && <TypewriterEffect key={title} content={content} />}
      </div>
    </div>
  );
};

const MainPage = () => {
  const [currentPage, setCurrentPage] = useState(null);

  const codingContent = ` My Projects: 
- Telemedic consult system
- Ethereum wallet tracker
- Zimbra auto mail bot
- Auto API check bot
- Gas line notify
- NFT
- Solidity & smartcontract`;

  const meContent = `About Me:
- Software Developer
- Cybersecurity Engineer Intern
- IEEE author`;

  const producingContent = ` My Productions:
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
            <button style={styles.backButton} onClick={() => setCurrentPage(null)}>Back</button>
            <div style={styles.boxContainer}>
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
          <div style={styles.boxContainer}>
            <Box title="Coding" content={codingContent} />
            <Box title="Me" content={meContent} />
            <Box title="Producing" content={producingContent} />
          </div>
        );
    }
  };

  return (
    <div style={styles.mainPage}>
      <header style={styles.header}>
        <h1 style={styles.title}>GM! I'm Kai.</h1>
        <h2 style={styles.subtitle}>Welcome to my digital gallery.</h2>
      </header>
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default MainPage;
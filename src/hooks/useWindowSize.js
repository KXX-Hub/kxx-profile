import { useState, useEffect } from 'react';
import { THEME } from '../config/constants';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: width <= parseInt(THEME.breakpoints.mobile),
        isTablet: width <= parseInt(THEME.breakpoints.tablet),
        isLaptop: width <= parseInt(THEME.breakpoints.laptop),
        isDesktop: width <= parseInt(THEME.breakpoints.desktop)
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize; 

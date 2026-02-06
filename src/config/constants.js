import { FaCode, FaUser, FaEthereum, FaYoutube, FaCamera, FaVideo, FaGraduationCap } from 'react-icons/fa';

export const NAVIGATION_ITEMS = [
  { 
    title: 'Me',
    path: '/me',
    icon: FaGraduationCap,
    description: 'Learn more about my journey'
  },
  { 
    title: 'Coding',
    path: '/coding',
    icon: FaCode,
    description: 'View my coding projects and contributions'
  },
  { 
    title: 'Photos',
    path: '/photos',
    icon: FaCamera,
    description: 'Browse my photography collection'
  },
  { 
    title: 'Videos',
    path: '/videos',
    icon: FaVideo,
    description: 'Watch my coding and life vlogs'
  },
  { 
    title: 'NFT',
    path: '/nft',
    icon: FaEthereum,
    description: 'Explore my NFT collections'
  }
];

export const SOCIAL_LINKS = [
  {
    platform: 'GitHub',
    url: 'https://github.com/KXX-HUB',
    icon: 'FaGithub'
  },
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/kai-hung-0xkxx/',
    icon: 'FaLinkedin'
  },
  {
    platform: 'Instagram',
    url: 'https://www.instagram.com/0x_kxx/',
    icon: 'FaInstagram',
    label: 'Personal'
  },
  {
    platform: 'Instagram',
    url: 'https://www.instagram.com/0xkxx_prod/',
    icon: 'FaMusic',
    label: 'Production'
  }
];

export const THEME = {
  colors: {
    primary: '#00ff9d',
    secondary: '#0066ff',
    accent: '#ff0066',
    background: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#b0b0b0'
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1200px'
  }
}; 

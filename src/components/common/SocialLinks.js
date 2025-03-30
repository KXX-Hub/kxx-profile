import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaMusic } from 'react-icons/fa';

const socialLinks = [
  { icon: <FaGithub />, url: 'https://github.com/KXX-HUB', label: 'GitHub' },
  { icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/kai-hung-0xkxx/', label: 'LinkedIn' },
  { icon: <FaInstagram />, url: 'https://www.instagram.com/0x_kxx/', label: 'Instagram Personal' },
  { icon: <FaMusic />, url: 'https://www.instagram.com/0xkxx_prod/', label: 'Instagram Production' },
];

const SocialLinks = ({ className = 'social-links' }) => {
  return (
    <div className={className}>
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={link.label}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks; 

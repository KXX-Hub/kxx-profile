import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './css/CodingPage.css';

const CodingPage = () => {
  const projects = [
    {
      title: "Telemedicine Consult System",
      description: "A backend system for telemedicine consultation using Line Bot",
      tech: ["Node.js", "Line Bot API", "MongoDB", "Express"],
      link: "https://github.com/HappyGroupHub/TelemedicConsult-Backend-LineBot"
    },
    {
      title: "Ethereum Wallet Tracker",
      description: "Track and monitor Ethereum wallet activities",
      tech: ["React", "Web3.js", "Ethereum", "Node.js"],
      link: "https://github.com/HappyGroupHub/Ethereum-Wallet-Tracker"
    },
    {
      title: "Zimbra Auto Mail Bot",
      description: "Automated email management system for Zimbra",
      tech: ["Python", "Zimbra API", "Automation"],
      link: "https://github.com/KXX-Hub/Zimbra_Auto_Mail_Bot"
    },
    {
      title: "Auto API Check Bot",
      description: "Automated API monitoring and testing system",
      tech: ["Python", "API Testing", "Automation"],
      link: "https://github.com/KXX-Hub/Auto_API_Check_Bot"
    },
    {
      title: "Gas Line Notify",
      description: "Ethereum gas price notification system via Line",
      tech: ["Node.js", "Line Bot API", "Ethereum", "Web3.js"],
      link: "https://github.com/KXX-Hub/Line_Gas_Notify"
    },
    {
      title: "Solidity, NFT & Smart Contract",
      description: "Blockchain development projects and tutorials",
      tech: ["Solidity", "NFT", "Smart Contract", "Web3"],
      link: "https://github.com/KXX-Hub/IThome"
    }
  ];

  return (
    <div className="coding-page">
      <div className="profile-header">
        <h1 className="pixel-page-title">Code Portfolio</h1>
        <div className="profile-links">
          <a href="https://github.com/KXX-HUB" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/kai-hung-0xkxx/" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaLinkedin />
          </a>
        </div>
      </div>

      <div className="coding-container">
        <div className="projects-section">
          <h2>My Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="view-project">
                    View on GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CodingPage;

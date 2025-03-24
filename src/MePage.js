import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaGraduationCap, FaBriefcase, FaCode, FaAward, FaChalkboardTeacher, FaLaptopCode, FaUsers, FaStar, FaCertificate, FaTimes, FaList } from 'react-icons/fa';
import './css/MePage.css';

const TimelineItem = ({ year, title, subtitle, description, icon, isLeft, category }) => (
  <div className={`timeline-item ${isLeft ? 'left' : 'right'} ${category}`}>
    <div className="timeline-content">
      <div className={`timeline-icon ${category}`}>
        {icon}
      </div>
      <div className="timeline-date">{year}</div>
      <h3 className="timeline-title">{title}</h3>
      <div className="timeline-subtitle">{subtitle}</div>
      <p className="timeline-description">{description}</p>
    </div>
  </div>
);

const FilterButton = ({ active, onClick, children, category }) => (
  <button 
    className={`filter-btn ${active ? 'active' : ''}`}
    onClick={onClick}
    data-category={category}
  >
    {children}
  </button>
);

const MePage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const experiences = [
    {
      year: '2022 - Present',
      title: 'Professional Certifications',
      subtitle: 'Cybersecurity & Technical Skills',
      description: (
        <>
          <div className="certificate-links">
            <div className="certificate-item">
              <h4>Google Cybersecurity Specialization</h4>
              <a href="https://www.coursera.org/account/accomplishments/specialization/E01NJ110WUJ0" target="_blank" rel="noopener noreferrer" className="timeline-link">
                View Certificate
              </a>
            </div>
            <div className="certificate-item">
              <h4>EC-Council Certifications</h4>
              <ul>
                <li>Certified Ethical Hacker (CEH)</li>
                <li>Ethical Hacking Essentials (EHE)</li>
                <li>Network Defense Essentials (NDE)</li>
              </ul>
            </div>
          </div>
          <div className="certificate-details">
            <p>• Technical Stack: Python, MySQL, Java, Git, Solidity, React, Linux, Kubernetes</p>
          </div>
        </>
      ),
      icon: <FaCertificate />,
      category: 'certification'
    },
    {
      year: '2025 - Present',
      title: 'University of Illinois Urbana-Champaign',
      subtitle: 'Master of Science in Information Management',
      description: 'Specializing in Data Science & Analytics, Information Architecture, and Digital Innovation. Focus on Data Analytics and Information Systems.',
      icon: <FaGraduationCap />,
      category: 'education'
    },
    {
      year: '2020 - 2024',
      title: 'Fu Jen Catholic University',
      subtitle: 'Bachelor of Science in Medical Information Innovation Application',
      description: 'Research focus on Medical Informatics System, Blockchain Technology and Cybersecurity. Graduated with distinction.',
      icon: <FaGraduationCap />,
      category: 'education'
    },
    {
      year: '2024',
      title: 'Teaching Assistant',
      subtitle: 'Information and Communication Security and Practices, FJU',
      description: 'Marked students\' course assessments and midterm/final exams. Assisted professors in preparing teaching materials and conducting practical sessions.',
      icon: <FaChalkboardTeacher />,
      category: 'work'
    },
    {
      year: '2024',
      title: 'IEEE Conference Publications',
      subtitle: 'International Conference on Applied System Innovation',
      description: (
        <>
          Second author of two research papers:
          <br />
          1. <a href="https://link.springer.com/chapter/10.1007/978-3-031-64957-8_8" target="_blank" rel="noopener noreferrer" className="timeline-link">
            "A Social-Software-Based Telemedicine Information System for Facilitating Healthcare Services"
          </a>
          <br />
          2. <a href="https://link.springer.com/chapter/10.1007/978-3-031-64957-8_11" target="_blank" rel="noopener noreferrer" className="timeline-link">
            "A New Notification System for Tracking Ethereum Transactions with Social Media Software"
          </a>
        </>
      ),
      icon: <FaAward />,
      category: 'education'
    },
    {
      year: '2023',
      title: 'Cybersecurity Engineer Intern',
      subtitle: 'Galaxy Software Service Co. Ltd. (Mend)',
      description: 'Developed customized programs for data comparison, integrated open source vulnerability scanning into CI pipelines (GitHub, GitLab, Azure DevOps). Created automated mailing system and provided vulnerability analysis reports to 40+ clients including banks and financial institutions.',
      icon: <FaLaptopCode />,
      category: 'work'
    },
    {
      year: '2022 - 2023',
      title: 'E-commerce Platform Management',
      subtitle: 'Social Media Marketing',
      description: 'Managed Korean clothing store operations, created marketing content, and implemented successful social media strategies. Increased sales by 70% through targeted marketing campaigns.',
      icon: <FaUsers />,
      category: 'work'
    },
    {
      year: '2022',
      title: 'Community Moderator',
      subtitle: 'The Remade Design Company',
      description: 'Guided newcomers in blockchain technology, produced educational content, and managed NFT community. Planned and executed online activities while promoting information security awareness.',
      icon: <FaBriefcase />,
      category: 'work'
    },
    {
      year: '2022',
      title: 'Technical Projects',
      subtitle: 'Hackathon & Development',
      description: 'Developed a horoscope fortune-telling chatbot using Python and LINE API. Created back-end computing logic and integrated with Webhook functionality.',
      icon: <FaCode />,
      category: 'work'
    },
    {
      year: '2022',
      title: 'Technical Blogger',
      subtitle: 'iThome Iron Man Competition',
      description: (
        <>
          Published a 30-day article series about blockchain development and smart contracts. View the complete series and code at{' '}
          <a href="https://github.com/KXX-Hub/IThome" target="_blank" rel="noopener noreferrer" className="timeline-link">
            GitHub Repository
          </a>
        </>
      ),
      icon: <FaAward />,
      category: 'work'
    },
    {
      year: '2022',
      title: 'Summer Camp Program',
      subtitle: 'English Teacher - Ministry of Education',
      description: 'Taught English to students with low academic performance, designed personalized courses. 75% of students achieved scores of 80+ on English proficiency tests.',
      icon: <FaChalkboardTeacher />,
      category: 'work'
    }
  ];

  const overviewData = {
    education: [
      'UIUC MSIM (2025-Present)',
      'FJU BS in Medical Information (2020-2024)',
      'IEEE Conference Publications'
    ],
    work: [
      'Cybersecurity Engineer Intern at Galaxy Software',
      'Teaching Assistant at FJU',
      'Community Moderator at The Remade Design',
      'E-commerce Platform Management',
      'Technical Blogger at iThome'
    ],
    certifications: [
      'Google Cybersecurity Specialization',
      'EC-Council Certified (CEH, EHE, NDE)',
      'Technical Stack: Python, MySQL, Java, Git, Solidity, React, Linux, Kubernetes'
    ]
  };

  const filteredExperiences = experiences.filter(exp => 
    activeFilter === 'all' ? true : exp.category === activeFilter
  );

  const handleFilter = (category) => {
    setActiveFilter(category);
  };

  const clearFilter = () => {
    setActiveFilter('all');
  };

  return (
    <div className="me-page">
      <div className="profile-header">
        <h1>About Me</h1>
        <div className="profile-links">
          <a href="https://github.com/KXX-Hub" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/kai-hung-0xkxx/" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaLinkedin />
          </a>
        </div>
      </div>

      <div className="overview-section">
        <h1>Overview</h1>
        <div className="overview-blocks">
          <div className="overview-block">
            <h2>Education</h2>
            <ul>
              {overviewData.education.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="overview-block">
            <h2>Work Experience</h2>
            <ul>
              {overviewData.work.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="overview-block">
            <h2>Certifications & Skills</h2>
            <ul>
              {overviewData.certifications.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-buttons">
          <FilterButton 
            active={activeFilter === 'all'} 
            onClick={() => handleFilter('all')}
            category="all"
          >
            <FaList /> All
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'education'} 
            onClick={() => handleFilter('education')}
            category="education"
          >
            <FaGraduationCap /> Education
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'work'} 
            onClick={() => handleFilter('work')}
            category="work"
          >
            <FaBriefcase /> Work
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'certification'} 
            onClick={() => handleFilter('certification')}
            category="certification"
          >
            <FaCertificate /> Certifications
          </FilterButton>
          {activeFilter !== 'all' && (
            <button className="clear-filter" onClick={clearFilter}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <div className="timeline-container">
        <div className="timeline-line"></div>
        {filteredExperiences.map((exp, index) => (
          <TimelineItem
            key={index}
            {...exp}
            isLeft={index % 2 === 0}
            className={`timeline-item ${exp.category === activeFilter ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="button-container">
        <Link to="/" className="back-home-btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default MePage;

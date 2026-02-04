import React, { useState, useEffect, useCallback } from 'react';
import '../css/ClickExplosion.css';

const ClickExplosion = () => {
  const [explosions, setExplosions] = useState([]);

  const createExplosion = useCallback((x, y) => {
    const id = Date.now();
    const particleCount = 8 + Math.floor(Math.random() * 5); // 8-12 particles
    
    const particles = Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * 360;
      const velocity = 50 + Math.random() * 80; // Random velocity
      const size = 3 + Math.floor(Math.random() * 4); // 3-6px
      const colors = ['#D4A574', '#C9C0B0', '#ECECEC', '#4F4540']; // Amber/cream palette
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        id: `${id}-${i}`,
        angle,
        velocity,
        size,
        color,
      };
    });

    const explosion = { id, x, y, particles };
    setExplosions(prev => [...prev, explosion]);

    // Remove explosion after animation
    setTimeout(() => {
      setExplosions(prev => prev.filter(e => e.id !== id));
    }, 600);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      createExplosion(e.clientX, e.clientY);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [createExplosion]);

  return (
    <div className="click-explosion-container">
      {explosions.map(explosion => (
        <div
          key={explosion.id}
          className="explosion"
          style={{
            left: explosion.x,
            top: explosion.y,
          }}
        >
          {explosion.particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                '--angle': `${particle.angle}deg`,
                '--velocity': `${particle.velocity}px`,
                '--size': `${particle.size}px`,
                '--color': particle.color,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ClickExplosion;

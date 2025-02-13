import React from 'react';
import { Link } from 'react-router-dom';
import './SpaceZone.css';

const SpaceZone = () => {
  const spaceCards = [
    {
      title: 'Space Monitor',
      description: 'Track real-time space events, satellite positions, and astronomical phenomena in unprecedented detail.',
      path: '/space-monitor',
      image: '/card_images/neo.jpg',
      gradient: 'linear-gradient(45deg, #00ffff, #ff00ff)'
    },
    {
      title: 'Deep Space',
      description: 'Journey through the mysteries of distant galaxies, black holes, and cosmic phenomena that shape our universe.',
      path: '/deep-space',
      image: '/card_images/epic.jpg',
      gradient: 'linear-gradient(45deg, #00ffff, #ff00ff)'
    },
    {
      title: 'Tech Hub',
      description: 'Explore cutting-edge space technologies, scientific breakthroughs, and innovations shaping the future of space exploration.',
      path: '/tech-hub',
      image: '/card_images/techhub.jpg',
      gradient: 'linear-gradient(45deg, #00ffff, #ff00ff)'
    }
  ];

  return (
    <div className="space-zone">
      <div className="space-zone-header">
        <h1>Deep Space Explorer</h1>
        <p>
          Embark on an extraordinary journey through the cosmos. Discover the wonders of space exploration,
          from real-time satellite tracking to the mysteries of distant galaxies.
        </p>
      </div>
      
      <div className="space-cards-container">
        {spaceCards.map((card, index) => (
          <Link 
            to={card.path} 
            key={index} 
            className="space-card"
            style={{
              '--card-gradient': card.gradient,
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className="space-card-image">
              <img src={card.image} alt={card.title} />
            </div>
            <div className="space-card-content">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <div className="space-card-arrow">→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpaceZone;

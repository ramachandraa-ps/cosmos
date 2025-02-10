import React from 'react';
import { Link } from 'react-router-dom';
import './InteractionZone.css';

const InteractionZone = () => {
  const sections = [
    {
      title: 'Study Area',
      description: 'Dive into interactive learning experiences and expand your cosmic knowledge through engaging educational content.',
      image: '/card_images/study-area.jpg',
      path: '/interaction/study-area'
    },
    {
      title: 'Gaming Arena',
      description: 'Challenge yourself with our collection of space-themed games designed to entertain and educate.',
      image: '/card_images/gaming-arena.jpg',
      path: '/interaction/gaming-arena'
    }
  ];

  return (
    <div className="interaction-zone">
      <div className="interaction-zone-header">
        <h1>Interactive Learning Hub</h1>
        <p>
          Embark on an educational journey through space. Choose between focused study materials
          and engaging games designed to make learning an adventure.
        </p>
      </div>
      
      <div className="interaction-cards-container">
        {sections.map((section, index) => (
          <Link 
            to={section.path}
            key={index} 
            className="interaction-card"
            style={{
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className="interaction-card-image">
              <img src={section.image} alt={section.title} />
            </div>
            <div className="interaction-card-content">
              <h2>{section.title}</h2>
              <p>{section.description}</p>
              <div className="interaction-card-arrow">→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InteractionZone;

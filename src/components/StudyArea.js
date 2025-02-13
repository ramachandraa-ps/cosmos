import React from 'react';
import { Link } from 'react-router-dom';
import './InteractionZone.css';

const StudyArea = () => {
  const studyCards = [
    {
      title: 'Cosmic Architect',
      description: 'Design and build your own space stations and planetary bases. Learn about space architecture and engineering principles.',
      image: '/interaction/cosmic_architect.jpeg',
      path: '/cosmic-architect'
    },
    {
      title: 'Webinars',
      description: 'Join live sessions with space experts and astronomers. Get insights into the latest space discoveries and research.',
      image: '/interaction/Webinar.jpg',
      path: '/webinars'
    },
    {
      title: 'Space Lessons',
      description: 'Interactive tutorials and comprehensive space education modules. Master the fundamentals of astronomy and space science.',
      image: '/interaction/SL.jpg',
      path: '/space-lessons'
    },
    {
      title: 'Quiz Time',
      description: 'Test your knowledge with space-themed quizzes and challenges. Track your progress and earn cosmic achievements.',
      image: '/interaction/QuizTime.jpg',
      path: '/quiz-time'
    }
  ];

  return (
    <div className="study-area">
      <div className="study-area-header">
        <h1>Study Area</h1>
        <p>
          Embark on an educational journey through space. Choose from our diverse learning resources
          designed to expand your cosmic knowledge.
        </p>
      </div>
      
      <div className="interaction-cards-container">
        {studyCards.map((card, index) => (
          <Link 
            to={card.path}
            key={index} 
            className="interaction-card"
            style={{
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className="interaction-card-image">
              <img src={card.image} alt={card.title} />
            </div>
            <div className="interaction-card-content">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <div className="interaction-card-arrow">→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StudyArea;

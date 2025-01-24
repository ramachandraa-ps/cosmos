import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const TechHubContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const Card = styled.div`
  width: 300px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 70%;
  object-fit: cover;
  
  &[alt="Rockets"] {
    object-position: center 30%; /* This will move the rocket image down within its container */
  }
`;

const CardTitle = styled.h3`
  color: white;
  text-align: center;
  margin: 1rem 0;
  font-size: 1.5rem;
  text-transform: uppercase;
`;

const CardDescription = styled.p`
  color: #ddd;
  text-align: center;
  padding: 0 1rem;
  font-size: 0.9rem;
`;

function TechHub() {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Satellites',
      image: '/tech_hub/satellites/satellites_card.jpeg',
      description: 'Explore various satellites and space stations',
      path: '/tech-hub/satellites'
    },
    {
      title: 'Astronauts',
      image: '/tech_hub/astronauts/astronauts_card.jpeg',
      description: 'Learn about famous astronauts and space explorers',
      path: '/tech-hub/astronauts'
    },
    {
      title: 'Rockets',
      image: '/tech_hub/rockets/rockets_card.jpeg',
      description: 'Discover different types of rockets and spacecraft',
      path: '/tech-hub/rockets'
    }
  ];

  return (
    <TechHubContainer>
      <h1 style={{ color: 'white', marginBottom: '2rem' }}>Tech Hub</h1>
      <CardsContainer>
        {categories.map((category) => (
          <Card key={category.title} onClick={() => navigate(category.path)}>
            <CardImage src={category.image} alt={category.title} />
            <CardTitle>{category.title}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </Card>
        ))}
      </CardsContainer>
    </TechHubContainer>
  );
}

export default TechHub;

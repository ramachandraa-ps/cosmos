import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const TechHubContainer = styled.div`
  background: linear-gradient(to bottom, #0B0B2B, #1B1B4B);
  min-height: 100vh;
  color: #ffffff;
  padding: 6rem 2rem 2rem 2rem;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 3rem;
  opacity: 0.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const Card = styled.div`
  width: 300px;
  height: 400px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 70%;
  object-fit: cover;
  
  &[alt="Rockets"] {
    object-position: center 30%;
  }
`;

const CardTitle = styled.h3`
  color: white;
  text-align: center;
  margin: 1rem 0;
  font-size: 1.5rem;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  letter-spacing: 1px;
`;

const CardDescription = styled.p`
  color: #ddd;
  text-align: center;
  padding: 0 1rem;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  opacity: 0.9;
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
      <Title>Tech Hub</Title>
      <Subtitle>
        Discover the cutting-edge technology that powers space exploration
      </Subtitle>
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

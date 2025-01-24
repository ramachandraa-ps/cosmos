import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const GamesContainer = styled.div`
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

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const GameCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const GameImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const GameTitle = styled.h3`
  font-size: 1.5rem;
  color: #00ffff;
  margin-bottom: 1rem;
`;

const GameDescription = styled.p`
  color: #ffffff;
  opacity: 0.8;
  line-height: 1.6;
`;

const Games = () => {
  const navigate = useNavigate();

  const gamesList = [
    {
      title: 'Constellation Connect',
      image: '/games/constellation-connect.jpg',
      description: 'Connect the stars to form constellations while learning about their mythology and stories. Perfect for aspiring astronomers!',
      path: '/games/constellation-connect'
    },
    // Add more games here as they are developed
  ];

  return (
    <GamesContainer>
      <Title>Space Games</Title>
      <Subtitle>
        Embark on an educational journey through space with our collection of interactive games
      </Subtitle>
      <GamesGrid>
        {gamesList.map((game, index) => (
          <GameCard key={index} onClick={() => navigate(game.path)}>
            <GameImage src={game.image} alt={game.title} />
            <GameTitle>{game.title}</GameTitle>
            <GameDescription>{game.description}</GameDescription>
          </GameCard>
        ))}
      </GamesGrid>
    </GamesContainer>
  );
};

export default Games;

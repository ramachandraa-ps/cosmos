import React from 'react';
import styled from 'styled-components';
import CelestialChallenge from './CelestialChallenge';

const InteractionContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #0B0B2B, #1B1B4B);
  padding: 20px;
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const InteractionZone = () => {
  return (
    <InteractionContainer>
      <Title>Space Interaction Zone</Title>
      <CelestialChallenge />
    </InteractionContainer>
  );
};

export default InteractionZone;

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Container = styled.div`
  position: fixed;
  top: 100px;
  right: 20px;
  width: 400px;
  background: rgba(15, 15, 25, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(166, 255, 0, 0.1);
  color: white;
  max-height: 80vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  background: linear-gradient(45deg, #00aeff, #a6ff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
`;

const PlanetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PlanetItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: grab;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const PlanetPreview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 0 20px ${props => props.color}50;
`;

const PlanetInfo = styled.div`
  flex: 1;
`;

const PlanetName = styled.h4`
  margin: 0;
  color: #fff;
  font-size: 1rem;
`;

const PlanetStats = styled.p`
  margin: 0.2rem 0 0 0;
  color: #aaa;
  font-size: 0.8rem;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #00aeff20, #a6ff0020);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #00aeff40, #a6ff0040);
    transform: translateY(-2px);
  }
`;

// 3D Planet Component
const Planet = ({ position, color, size, orbitRadius }) => {
  const meshRef = useRef();
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    meshRef.current.position.x = Math.cos(time * 0.5) * orbitRadius;
    meshRef.current.position.z = Math.sin(time * 0.5) * orbitRadius;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// Orbit Path Component
const OrbitPath = ({ radius }) => {
  const points = [];
  const segments = 64;
  
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(
      Math.cos(theta) * radius,
      0,
      Math.sin(theta) * radius
    );
  }

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={segments + 1}
          array={new Float32Array(points)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff20" />
    </line>
  );
};

const SolarSystemDesigner = () => {
  const [planets, setPlanets] = useState([
    { id: 1, name: 'Rocky Planet', color: '#ff6b6b', size: 1, orbitRadius: 5 },
    { id: 2, name: 'Gas Giant', color: '#4ecdc4', size: 2.5, orbitRadius: 10 },
    { id: 3, name: 'Ice World', color: '#45b7d1', size: 1.5, orbitRadius: 15 }
  ]);

  const handleAddPlanet = () => {
    const newPlanet = {
      id: planets.length + 1,
      name: `Planet ${planets.length + 1}`,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      size: Math.random() * 2 + 0.5,
      orbitRadius: (planets.length + 1) * 5
    };
    setPlanets([...planets, newPlanet]);
  };

  return (
    <Container>
      <Title>Solar System Designer</Title>
      <PlanetList>
        {planets.map(planet => (
          <PlanetItem key={planet.id}>
            <PlanetPreview color={planet.color} />
            <PlanetInfo>
              <PlanetName>{planet.name}</PlanetName>
              <PlanetStats>
                Size: {planet.size.toFixed(1)}x Earth | 
                Orbit: {planet.orbitRadius} AU
              </PlanetStats>
            </PlanetInfo>
          </PlanetItem>
        ))}
      </PlanetList>
      <AddButton onClick={handleAddPlanet}>
        Add New Planet
      </AddButton>
    </Container>
  );
};

export default SolarSystemDesigner;

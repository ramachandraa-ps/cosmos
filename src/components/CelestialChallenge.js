import React, { useState, useRef, Suspense } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ChallengeContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #0B0B2B, #1B1B4B);
`;

const MainCanvas = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: radial-gradient(circle at center, #000235 0%, #000000 100%);
  position: relative;
`;

const SolarSystemView = styled.div`
  width: 100%;
  height: 400px;
  margin: 20px 0;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const InstructionText = styled.p`
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.2em;
  opacity: 0.8;
`;

const PlanetPalette = styled.div`
  width: 500px;
  min-height: 100vh;
  padding: 30px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 15px;
  overflow-y: auto;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
`;

const PlanetsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const PlanetCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  margin: 5px;
  cursor: move;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }
`;

const PlanetName = styled.h3`
  color: #fff;
  margin: 8px 0 4px;
  font-size: 1em;
  text-align: center;
  white-space: nowrap;
`;

const PlanetInfo = styled.p`
  color: #ccc;
  margin: 0;
  font-size: 0.75em;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
`;

const FeedbackMessage = styled.div`
  color: #4CAF50;
  font-size: 1.2em;
  margin: 20px 0;
  padding: 10px 20px;
  border-radius: 5px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid #4CAF50;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: #fff;
  font-size: 1.5em;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ResetButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const PlanetSlots = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  flex-wrap: wrap;
  max-width: 1200px;
`;

const planetData = [
  {
    name: 'Mercury',
    color: '#A0A0A0',
    scale: 0.4,
    info: 'Smallest and innermost planet',
    ringScale: 0
  },
  {
    name: 'Venus',
    color: '#E6B800',
    scale: 0.6,
    info: 'Hottest planet in our solar system',
    ringScale: 0
  },
  {
    name: 'Earth',
    color: '#4B8BE6',
    scale: 0.6,
    info: 'Our home planet',
    ringScale: 0
  },
  {
    name: 'Mars',
    color: '#E67346',
    scale: 0.5,
    info: 'The Red Planet',
    ringScale: 0
  },
  {
    name: 'Jupiter',
    color: '#E6A346',
    scale: 1.2,
    info: 'Largest planet in our solar system',
    ringScale: 0
  },
  {
    name: 'Saturn',
    color: '#E6CF9C',
    scale: 1.0,
    info: 'Known for its beautiful rings',
    ringScale: 1
  },
  {
    name: 'Uranus',
    color: '#9CC4E6',
    scale: 0.8,
    info: 'Ice giant with tilted rotation',
    ringScale: 0.5
  },
  {
    name: 'Neptune',
    color: '#4B6BE6',
    scale: 0.8,
    info: 'Windiest planet',
    ringScale: 0
  }
];

const Planet = ({ color, scale = 1, position = [0, 0, 0], ringScale = 0, isPlaced = false }) => {
  const meshRef = useRef();
  const ringRef = useRef();
  const atmosphereRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      
      // Add floating animation when placed
      if (isPlaced) {
        const floatY = Math.sin(time * 0.5) * 0.2;
        meshRef.current.position.y = position[1] + floatY;
        if (ringRef.current) ringRef.current.position.y = position[1] + floatY;
        if (atmosphereRef.current) atmosphereRef.current.position.y = position[1] + floatY;
      }
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Planet surface */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial 
          color={color}
          metalness={0.1}
          roughness={0.7}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Rings for Saturn/Uranus */}
      {ringScale > 0 && (
        <group>
          <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.6, 2.5, 128]} />
            <meshPhysicalMaterial
              color="#C0A080"
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
              metalness={0.3}
              roughness={0.6}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.4, 1.6, 64]} />
            <meshStandardMaterial
              color="#806040"
              side={THREE.DoubleSide}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

const PlanetPreview = ({ color, scale, ringScale }) => {
  return (
    <div style={{ 
      width: '90px', 
      height: '90px',
      background: 'transparent'
    }}>
      <Canvas 
        camera={{ position: [0, 2, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.0} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <Suspense fallback={null}>
          <Planet 
            color={color}
            scale={scale * 2}
            ringScale={ringScale}
          />
        </Suspense>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

const PlanetSlot = ({ index, isOccupied, isCorrect, onDrop }) => {
  const borderColor = isOccupied 
    ? (isCorrect ? '#4CAF50' : '#f44336')
    : 'rgba(255, 255, 255, 0.3)';

  return (
    <div
      style={{
        width: '100px',
        height: '100px',
        border: `2px dashed ${borderColor}`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        background: isOccupied 
          ? (isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
          : 'transparent'
      }}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    />
  );
};

const PlacedPlanet = ({ color, scale, ringScale }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.0} />
        <Planet 
          color={color}
          scale={scale * 2}
          ringScale={ringScale}
        />
      </Canvas>
    </div>
  );
};

const SolarSystem = ({ planets }) => {
  return (
    <Canvas camera={{ position: [0, 20, 30], fov: 45 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.0} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Suspense fallback={null}>
        {/* Sun */}
        <mesh position={[-20, 0, 0]}>
          <sphereGeometry args={[3, 32, 32]} />
          <meshStandardMaterial
            color="#FDB813"
            emissive="#FDB813"
            emissiveIntensity={2}
          />
        </mesh>
        
        {/* Planets */}
        {planets.map((planet, index) => 
          planet && (
            <Planet
              key={planet.name}
              {...planet}
              position={[index * 5 - 15, 0, 0]}
              isPlaced={true}
            />
          )
        )}
      </Suspense>
      
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={10}
        maxDistance={50}
      />
    </Canvas>
  );
};

const CelestialChallenge = () => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [planetOrder, setPlanetOrder] = useState(Array(8).fill(null));
  const [availablePlanets, setAvailablePlanets] = useState(() => {
    return [...planetData].sort(() => Math.random() - 0.5);
  });

  const handleDragStart = (e, planet) => {
    e.dataTransfer.setData('planet', JSON.stringify(planet));
  };

  const handleDrop = (e, slotIndex) => {
    e.preventDefault();
    const planet = JSON.parse(e.dataTransfer.getData('planet'));
    
    const newOrder = [...planetOrder];
    newOrder[slotIndex] = planet;
    setPlanetOrder(newOrder);
    
    setAvailablePlanets(prev => prev.filter(p => p.name !== planet.name));
    
    const correctOrder = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
    const isCorrect = newOrder.every((p, i) => p?.name === correctOrder[i]);
    
    if (isCorrect) {
      setScore(prev => prev + 100);
      setFeedback("Perfect! You've arranged the planets in the correct order!");
      setShowFeedback(true);
    }
  };

  const handleReset = () => {
    setPlanetOrder(Array(8).fill(null));
    setAvailablePlanets([...planetData].sort(() => Math.random() - 0.5));
    setShowFeedback(false);
  };

  return (
    <ChallengeContainer>
      <MainCanvas>
        <Title>Solar System Challenge</Title>
        <InstructionText>
          Drag and drop planets to their correct positions in order from the Sun
        </InstructionText>
        <SolarSystemView>
          <SolarSystem planets={planetOrder} />
        </SolarSystemView>
        <PlanetSlots>
          {planetOrder.map((planet, index) => {
            const correctOrder = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
            const isCorrect = planet?.name === correctOrder[index];
            
            return (
              <PlanetSlot
                key={index}
                index={index}
                isOccupied={Boolean(planet)}
                isCorrect={isCorrect}
                onDrop={(e) => handleDrop(e, index)}
              >
                {planet && <PlacedPlanet {...planet} />}
              </PlanetSlot>
            );
          })}
        </PlanetSlots>
        {showFeedback && <FeedbackMessage visible={showFeedback}>{feedback}</FeedbackMessage>}
        <ScoreDisplay>Score: {score}</ScoreDisplay>
      </MainCanvas>
      <PlanetPalette>
        <PlanetsContainer>
          {availablePlanets.map((planet) => (
            <PlanetCard
              key={planet.name}
              draggable
              onDragStart={(e) => handleDragStart(e, planet)}
            >
              <PlanetPreview {...planet} />
              <PlanetName>{planet.name}</PlanetName>
              <PlanetInfo>{planet.info}</PlanetInfo>
            </PlanetCard>
          ))}
        </PlanetsContainer>
        <ResetButton onClick={handleReset}>Reset Challenge</ResetButton>
      </PlanetPalette>
    </ChallengeContainer>
  );
};

export default CelestialChallenge;

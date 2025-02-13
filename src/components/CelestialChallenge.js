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
  position: relative;
`;

const MainCanvas = styled.div`
  flex: 1;
  padding: 6rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, #0B0B2B, #1B1B4B);
  position: relative;
  margin-right: 300px;
`;

const SolarSystemView = styled.div`
  width: 100%;
  height: 400px;
  margin: 20px 0;
  border-radius: 15px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  position: relative;
`;

const PlanetPalette = styled.div`
  width: 300px;
  height: 100vh;
  padding: 30px 20px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  position: fixed;
  right: 0;
  top: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.3);
  overflow-y: auto;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const PlanetSlots = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 40px 0;
  padding: 20px;
  flex-wrap: wrap;
  max-width: 1200px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3);
`;

const PlanetSlot = styled.div`
  width: 100px;
  height: 100px;
  border: 2px dashed ${props => props.isOccupied 
    ? (props.isCorrect ? '#4CAF50' : '#f44336')
    : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: ${props => props.isOccupied 
    ? (props.isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)')
    : 'transparent'};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const PlanetCard = styled.div`
  background: rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 15px;
  cursor: move;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  height: 160px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;

  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 25px rgba(31, 38, 135, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .planet-container {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
    position: relative;
  }

  span {
    color: white;
    font-size: 1rem;
    text-align: center;
    font-family: 'Inter', sans-serif;
    margin-top: auto;
  }
`;

const Title = styled.h2`
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

const InstructionText = styled.p`
  text-align: center;
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  font-family: 'Inter', sans-serif;
`;

const ScoreDisplay = styled.div`
  position: relative;
  margin: 20px auto;
  color: #fff;
  font-size: 1.2em;
  padding: 8px 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  z-index: 100;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
  width: fit-content;

  &::before {
    content: '🎯';
    font-size: 1em;
  }
`;

const ResetButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 200px;
  font-size: 1.1em;
  margin-top: auto;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const FeedbackMessage = styled.div`
  color: #4CAF50;
  font-size: 1.2em;
  margin: 20px 0;
  padding: 15px 30px;
  border-radius: 10px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid #4CAF50;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
  backdrop-filter: blur(5px);
  text-align: center;
  max-width: 80%;
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

const PlacedPlanet = ({ color, scale, ringScale }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.0} />
        <Planet 
          color={color}
          scale={scale * 2}
          ringScale={0}
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
  const [planetOrder, setPlanetOrder] = useState(Array(8).fill(null));
  const [availablePlanets, setAvailablePlanets] = useState(planetData);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleDragStart = (e, planet) => {
    e.dataTransfer.setData('planet', JSON.stringify(planet));
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const planet = JSON.parse(e.dataTransfer.getData('planet'));
    
    // Remove the planet from available planets
    setAvailablePlanets(prev => prev.filter(p => p.name !== planet.name));
    
    // Add planet to order
    const newOrder = [...planetOrder];
    newOrder[index] = planet;
    setPlanetOrder(newOrder);
    
    // Check if the placement is correct
    if (planet.name === planetData[index].name) {
      setScore(prev => prev + 10);
      setFeedback('Correct placement! +10 points');
    } else {
      setFeedback('Try again! That\'s not the correct position');
    }
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  const handleReset = () => {
    setPlanetOrder(Array(8).fill(null));
    setAvailablePlanets(planetData);
    setScore(0);
    setFeedback('');
  };

  return (
    <MainCanvas>
      <Title>Solar System Challenge</Title>
      <InstructionText>
        Drag and drop planets to their correct positions in order from the Sun
      </InstructionText>
      <SolarSystemView>
        <SolarSystem planets={planetOrder} />
      </SolarSystemView>
      <PlanetSlots>
        {[...Array(8)].map((_, index) => {
          const planet = planetOrder[index];
          return (
            <PlanetSlot
              key={index}
              isOccupied={!!planet}
              isCorrect={planet?.name === planetData[index].name}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, index)}
            >
              {planet && (
                <PlacedPlanet
                  color={planet.color}
                  scale={planet.scale * 0.6}
                  ringScale={0}
                />
              )}
            </PlanetSlot>
          );
        })}
      </PlanetSlots>
      <ScoreDisplay>Score: {score}</ScoreDisplay>
      {showFeedback && <FeedbackMessage visible={showFeedback}>{feedback}</FeedbackMessage>}
      <ResetButton onClick={handleReset}>Reset Challenge</ResetButton>
      <PlanetPalette>
        {availablePlanets.map((planet) => (
          <PlanetCard
            key={planet.name}
            draggable
            onDragStart={(e) => handleDragStart(e, planet)}
          >
            <div className="planet-container">
              <PlacedPlanet
                color={planet.color}
                scale={planet.scale * 0.6}
                ringScale={0}
              />
            </div>
            <span>{planet.name}</span>
          </PlanetCard>
        ))}
      </PlanetPalette>
    </MainCanvas>
  );
};

export default CelestialChallenge;

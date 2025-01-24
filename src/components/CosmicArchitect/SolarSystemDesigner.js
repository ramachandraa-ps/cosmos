import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './styles.css';

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
  z-index: 10;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(166, 255, 0, 0.3);
    border-radius: 4px;
  }
`;

const VisualizationCard = styled.div`
  position: fixed;
  top: 100px;
  left: 400px;
  width: calc(100% - 820px);
  height: calc(100vh - 140px);
  background: rgba(15, 15, 25, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(166, 255, 0, 0.1);
  overflow: hidden;
  z-index: 2;
`;

const Title = styled.h2`
  background: linear-gradient(45deg, #00aeff, #a6ff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #a6ff00;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 8px;
  padding: 0.8rem;
  color: white;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #a6ff00;
    box-shadow: 0 0 10px rgba(166, 255, 0, 0.2);
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 8px;
  padding: 0.8rem;
  color: white;
  width: 100%;
  cursor: pointer;

  option {
    background: #1a1a2e;
    color: white;
  }
`;

const Button = styled.button`
  background: ${props => props.disabled ? 
    'rgba(128, 128, 128, 0.3)' : 
    'linear-gradient(45deg, #00aeff, #a6ff00)'};
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  font-size: 1rem;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 5px 15px rgba(166, 255, 0, 0.2)'};
  }
`;

const PlanetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const PlanetItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(166, 255, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Star = ({ starType }) => {
  const starRef = useRef();
  
  useFrame((state, delta) => {
    if (starRef.current) {
      starRef.current.rotation.y += delta * 0.2;
    }
  });

  const getStarColor = () => {
    switch(starType) {
      case 'red-dwarf': return '#ff4444';
      case 'blue-giant': return '#4444ff';
      case 'white-dwarf': return '#ffffff';
      default: return '#ffff44'; // Yellow dwarf (Sun-like)
    }
  };

  return (
    <mesh ref={starRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={getStarColor()}
        emissive={getStarColor()}
        emissiveIntensity={2}
      />
    </mesh>
  );
};

const Planet = ({ position, color, size, orbitRadius }) => {
  const planetRef = useRef();
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2);
  
  useFrame((state, delta) => {
    setAngle(prev => prev + delta * 0.3); 
    if (planetRef.current) {
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * orbitRadius;
      planetRef.current.position.x = x;
      planetRef.current.position.z = z;
      planetRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      <mesh ref={planetRef} position={[orbitRadius, 0, 0]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      <OrbitPath radius={orbitRadius} />
    </group>
  );
};

const OrbitPath = ({ radius }) => {
  const curve = new THREE.EllipseCurve(
    0, 0,            // Center x, y
    radius, radius,  // xRadius, yRadius
    0, 2 * Math.PI,  // Start angle, end angle
    false,           // Clockwise
    0               // Rotation
  );

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial attach="material" color="#ffffff" opacity={0.2} transparent />
    </line>
  );
};

const SolarSystemDesigner = () => {
  const [systemData, setSystemData] = useState({
    name: '',
    starType: 'yellow-dwarf',
    planets: []
  });

  const [showCongrats, setShowCongrats] = useState(false);
  const [currentPlanet, setCurrentPlanet] = useState({
    name: '',
    size: 0.3,
    color: '#44ff44',
    orbitRadius: 2
  });

  const handleSystemChange = (e) => {
    setSystemData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePlanetChange = (e) => {
    setCurrentPlanet(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addPlanet = (e) => {
    e.preventDefault();
    if (currentPlanet.name) {
      setSystemData(prev => ({
        ...prev,
        planets: [...prev.planets, { ...currentPlanet, id: Date.now() }]
      }));
      setCurrentPlanet({
        name: '',
        size: 0.3,
        color: '#44ff44',
        orbitRadius: systemData.planets.length * 2 + 2
      });
    }
  };

  const removePlanet = (id) => {
    setSystemData(prev => ({
      ...prev,
      planets: prev.planets.filter(planet => planet.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowCongrats(true);
  };

  return (
    <>
      <VisualizationCard>
        <Canvas camera={{ position: [0, 15, 25], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={2} />
          <Star starType={systemData.starType} />
          {systemData.planets.map((planet, index) => (
            <Planet
              key={planet.id}
              position={[planet.orbitRadius, 0, 0]}
              color={planet.color}
              size={planet.size}
              orbitRadius={planet.orbitRadius}
            />
          ))}
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            maxDistance={40}
            minDistance={5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
      </VisualizationCard>

      <Container>
        <Title>Solar System Designer</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>System Name</Label>
            <Input
              type="text"
              name="name"
              value={systemData.name}
              onChange={handleSystemChange}
              placeholder="Enter system name"
            />
          </FormGroup>

          <FormGroup>
            <Label>Star Type</Label>
            <Select
              name="starType"
              value={systemData.starType}
              onChange={handleSystemChange}
            >
              <option value="yellow-dwarf">Yellow Dwarf (Sun-like)</option>
              <option value="red-dwarf">Red Dwarf</option>
              <option value="blue-giant">Blue Giant</option>
              <option value="white-dwarf">White Dwarf</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Add Planet</Label>
            <Input
              type="text"
              name="name"
              value={currentPlanet.name}
              onChange={handlePlanetChange}
              placeholder="Planet name"
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Label style={{ margin: 0 }}>Size: {currentPlanet.size}</Label>
              <Input
                type="range"
                name="size"
                min="0.1"
                max="0.8"
                step="0.1"
                value={currentPlanet.size}
                onChange={handlePlanetChange}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Label style={{ margin: 0 }}>Color:</Label>
              <Input
                type="color"
                name="color"
                value={currentPlanet.color}
                onChange={handlePlanetChange}
                style={{ width: '50px', padding: '0' }}
              />
            </div>
            <Button type="button" onClick={addPlanet} disabled={!currentPlanet.name}>
              Add Planet
            </Button>
          </FormGroup>

          <PlanetList>
            {systemData.planets.map((planet, index) => (
              <PlanetItem key={planet.id}>
                <span>{planet.name}</span>
                <Button type="button" onClick={() => removePlanet(planet.id)}>
                  Remove
                </Button>
              </PlanetItem>
            ))}
          </PlanetList>

          <Button type="submit" disabled={!systemData.name || systemData.planets.length === 0}>
            Create Solar System
          </Button>
        </Form>
      </Container>

      {showCongrats && (
        <div className="congrats-overlay">
          <div className="congrats-card">
            <h2>Congratulations! 🎉</h2>
            <p>
              You've created the {systemData.name} system with a {systemData.starType} star
              and {systemData.planets.length} planets!
            </p>
            <Button onClick={() => setShowCongrats(false)}>Close</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default SolarSystemDesigner;

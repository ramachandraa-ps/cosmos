import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

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
`;

const PreviewContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  background: rgba(15, 15, 25, 0.3);
  border-radius: 50%;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(166, 255, 0, 0.1);
  overflow: hidden;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  background: linear-gradient(45deg, #00aeff, #a6ff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #a6ff00;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 5px;
  padding: 0.5rem;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #a6ff00;
  }

  &[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 5px;
    border-radius: 5px;
    background: rgba(166, 255, 0, 0.1);
    outline: none;
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: #a6ff00;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.2);
      }
    }
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 5px;
  padding: 0.5rem;
  color: white;
  font-size: 1rem;

  option {
    background: #24243e;
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #00aeff, #a6ff00);
  border: none;
  border-radius: 5px;
  padding: 0.8rem;
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

// 3D Planet Component
const Planet = ({ planetData }) => {
  const meshRef = useRef();
  
  // Simplified texture loading
  const baseTexture = useTexture('/textures/planet/base.jpg');

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  const getAtmosphereColor = () => {
    switch (planetData.atmosphere) {
      case 'earth-like':
        return '#4a90ff';
      case 'thick':
        return '#ff6b6b';
      case 'thin':
        return '#a8e6cf';
      default:
        return 'transparent';
    }
  };

  const getPlanetColor = () => {
    const temp = parseFloat(planetData.temperature);
    const water = parseFloat(planetData.water);
    
    if (water > 80) return '#1e88e5'; // Water world
    if (water > 50) return '#4caf50'; // Earth-like
    if (temp > 50) return '#ff5722'; // Hot desert
    if (temp < 0) return '#90a4ae'; // Ice world
    return '#795548'; // Rocky world
  };

  return (
    <group>
      {/* Atmosphere glow */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[planetData.size * 2, 32, 32]} />
        <meshStandardMaterial
          color={getAtmosphereColor()}
          transparent
          opacity={planetData.atmosphere === 'none' ? 0 : 0.2}
        />
      </mesh>
      
      {/* Planet surface */}
      <mesh ref={meshRef} scale={[planetData.size * 2, planetData.size * 2, planetData.size * 2]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={baseTexture}
          color={getPlanetColor()}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};

function PlanetBuilder({ onPlanetCreate }) {
  const [planetData, setPlanetData] = useState({
    name: '',
    size: '1',
    atmosphere: 'earth-like',
    gravity: '1',
    temperature: '20',
    water: '70'
  });

  const handleChange = (e) => {
    setPlanetData({
      ...planetData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onPlanetCreate) {
      onPlanetCreate(planetData);
    }
  };

  return (
    <>
      <Container>
        <Title>Planet Builder</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Planet Name</Label>
            <Input
              type="text"
              name="name"
              value={planetData.name}
              onChange={handleChange}
              placeholder="Enter planet name"
            />
          </FormGroup>

          <FormGroup>
            <Label>Size (Earth radius): {planetData.size}</Label>
            <Input
              type="range"
              name="size"
              value={planetData.size}
              onChange={handleChange}
              min="0.1"
              max="3"
              step="0.1"
            />
          </FormGroup>

          <FormGroup>
            <Label>Atmosphere Type</Label>
            <Select name="atmosphere" value={planetData.atmosphere} onChange={handleChange}>
              <option value="earth-like">Earth-like</option>
              <option value="thick">Thick (Venus-like)</option>
              <option value="thin">Thin (Mars-like)</option>
              <option value="none">None</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Surface Gravity (g): {planetData.gravity}</Label>
            <Input
              type="range"
              name="gravity"
              value={planetData.gravity}
              onChange={handleChange}
              min="0.1"
              max="3"
              step="0.1"
            />
          </FormGroup>

          <FormGroup>
            <Label>Average Temperature (°C): {planetData.temperature}</Label>
            <Input
              type="range"
              name="temperature"
              value={planetData.temperature}
              onChange={handleChange}
              min="-50"
              max="100"
              step="1"
            />
          </FormGroup>

          <FormGroup>
            <Label>Water Coverage (%): {planetData.water}</Label>
            <Input
              type="range"
              name="water"
              value={planetData.water}
              onChange={handleChange}
              min="0"
              max="100"
              step="1"
            />
          </FormGroup>

          <Button type="submit">Create Planet</Button>
        </Form>
      </Container>

      <PreviewContainer>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Planet planetData={planetData} />
        </Canvas>
      </PreviewContainer>
    </>
  );
}

export default PlanetBuilder;

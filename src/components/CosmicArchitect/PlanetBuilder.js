import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Container = styled.div`
  position: fixed;
  top: 50px;
  right: 20px;
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(15, 15, 25, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(166, 255, 0, 0.1);
  color: white;

  /* Custom scrollbar */
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

const ControlGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #a6ff00;
`;

const Slider = styled.input`
  width: 100%;
  margin-bottom: 0.5rem;
`;

const Value = styled.span`
  float: right;
  color: #a6ff00;
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

const PlanetBuilder = () => {
  const [planetData, setPlanetData] = useState({
    name: '',
    size: '1',
    atmosphere: 'earth-like',
    gravity: '1',
    temperature: '20',
    water: '70',
    land: '30'
  });

  const handleChange = (e) => {
    setPlanetData({
      ...planetData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <Label>
              Size <Value>{planetData.size}x</Value>
            </Label>
            <Slider
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              name="size"
              value={planetData.size}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Atmosphere Type
            </Label>
            <Select name="atmosphere" value={planetData.atmosphere} onChange={handleChange}>
              <option value="none">None</option>
              <option value="thin">Thin</option>
              <option value="earth-like">Earth-like</option>
              <option value="thick">Thick</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              Temperature <Value>{planetData.temperature}°C</Value>
            </Label>
            <Slider
              type="range"
              min="-50"
              max="100"
              name="temperature"
              value={planetData.temperature}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Water Coverage <Value>{planetData.water}%</Value>
            </Label>
            <Slider
              type="range"
              min="0"
              max="100"
              name="water"
              value={planetData.water}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Land Mass <Value>{planetData.land}%</Value>
            </Label>
            <Slider
              type="range"
              min="0"
              max="100"
              name="land"
              value={planetData.land}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              Gravity <Value>{planetData.gravity}g</Value>
            </Label>
            <Slider
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              name="gravity"
              value={planetData.gravity}
              onChange={handleChange}
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
};

// 3D Planet Component
const Planet = ({ planetData }) => {
  const meshRef = useRef();
  
  const [planetTexture] = useState(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Create base ocean
    const waterPercent = parseFloat(planetData.water);
    const landPercent = parseFloat(planetData.land);
    const temp = parseFloat(planetData.temperature);
    
    // Create base water color based on temperature
    let waterColor = temp < 0 ? '#b0bec5' : '#1976d2';
    ctx.fillStyle = waterColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Function to create a landmass
    const createLandmass = (x, y, size, type) => {
        ctx.beginPath();
        
        // Create a more natural shape using multiple circles
        const points = [];
        const segments = 24;
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const radius = size * (0.7 + Math.random() * 0.6); // More variation
            points.push({
                x: x + Math.cos(angle) * radius,
                y: y + Math.sin(angle) * radius
            });
        }
        
        // Draw the shape
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const xc = (points[i].x + points[i - 1].x) / 2;
            const yc = (points[i].y + points[i - 1].y) / 2;
            ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }
        ctx.closePath();
        
        // Color based on type
        let mainColor;
        switch(type) {
            case 'forest':
                mainColor = '#2e7d32';
                break;
            case 'desert':
                mainColor = '#d7ccc8';
                break;
            case 'mountain':
                mainColor = '#795548';
                break;
            default:
                mainColor = '#4caf50';
        }
        
        // Create gradient for more natural look
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, mainColor);
        gradient.addColorStop(1, shadeColor(mainColor, -20));
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add terrain detail
        const detailCount = size / 4;
        for (let i = 0; i < detailCount; i++) {
            const detailX = x + (Math.random() - 0.5) * size * 2;
            const detailY = y + (Math.random() - 0.5) * size * 2;
            const detailSize = 5 + Math.random() * 15;
            
            ctx.beginPath();
            ctx.arc(detailX, detailY, detailSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.1})`;
            ctx.fill();
        }
    };
    
    // Helper function to shade colors
    function shadeColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    }
    
    // Calculate number and size of landmasses based on land percentage
    const totalLandArea = (canvas.width * canvas.height) * (landPercent / 100);
    const avgLandmassSize = Math.sqrt(totalLandArea / 5); // Divide into ~5 landmasses
    const numLandmasses = Math.max(1, Math.floor(landPercent / 15)); // At least 1 landmass
    
    // Create landmasses
    for (let i = 0; i < numLandmasses; i++) {
        const x = Math.random() * canvas.width;
        const y = (canvas.height * 0.3) + Math.random() * (canvas.height * 0.4); // Keep away from poles
        const size = avgLandmassSize * (0.7 + Math.random() * 0.6);
        
        // Determine terrain type
        let type;
        if (temp > 40) {
            type = Math.random() > 0.3 ? 'desert' : 'mountain';
        } else if (temp < 0) {
            type = Math.random() > 0.7 ? 'mountain' : 'forest';
        } else {
            type = Math.random() > 0.6 ? 'forest' : 
                   Math.random() > 0.5 ? 'mountain' : 'desert';
        }
        
        createLandmass(x, y, size, type);
    }
    
    // Add ice caps if cold
    if (temp < 10) {
        const iceCap = Math.max(0.1, Math.min(0.3, (10 - temp) / 30));
        ctx.fillStyle = '#eceff1';
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height * iceCap);
        ctx.rect(0, canvas.height * (1 - iceCap), canvas.width, canvas.height * iceCap);
        ctx.fill();
    }
    
    // Add clouds based on atmosphere
    if (planetData.atmosphere !== 'none') {
        const cloudOpacity = planetData.atmosphere === 'thick' ? 0.4 : 0.2;
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = 20 + Math.random() * 60;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, `rgba(255,255,255,${cloudOpacity})`);
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
});

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

  return (
    <group>
      {/* Atmosphere glow */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[planetData.size * 2, 32, 32]} />
        <meshBasicMaterial
          color={getAtmosphereColor()}
          transparent
          opacity={planetData.atmosphere === 'none' ? 0 : 0.2}
        />
      </mesh>
      
      {/* Planet surface */}
      <mesh ref={meshRef} scale={[planetData.size * 2, planetData.size * 2, planetData.size * 2]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={planetTexture}
          metalness={0.1}
          roughness={0.8}
          bumpMap={planetTexture}
          bumpScale={0.05}
        />
      </mesh>

      {/* Cloud layer */}
      {(planetData.atmosphere === 'earth-like' || planetData.atmosphere === 'thick') && (
        <mesh scale={[1.02, 1.02, 1.02].map(s => s * planetData.size * 2)}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            depthWrite={false}
            alphaMap={planetTexture}
          />
        </mesh>
      )}
    </group>
  );
};

export default PlanetBuilder;

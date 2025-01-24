import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import cosmicArchitectImage from '../../assets/cosmic_architect.jpeg';

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
  z-index: 3; 
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
  background: ${props => props.disabled ? 
    'rgba(128, 128, 128, 0.3)' : 
    'linear-gradient(45deg, #00aeff, #a6ff00)'};
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  margin-top: 1rem;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 5px 15px rgba(166, 255, 0, 0.2)'};
  }
`;

const CongratsOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const CongratsCard = styled.div`
  background: rgba(15, 15, 25, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  border: 1px solid rgba(166, 255, 0, 0.2);
  text-align: center;
  animation: slideUp 0.5s ease;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  h2 {
    background: linear-gradient(45deg, #00aeff, #a6ff00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
  }

  p {
    color: white;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
`;

const CardImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  object-fit: cover;
  display: block;
  margin: 0 auto 1.5rem;
`;

const CloseButton = styled(Button)`
  background: linear-gradient(45deg, #ff4b4b, #ff8f00);
  padding: 8px 16px;
  font-size: 0.9rem;
`;

const Layout = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 1;
`;

const CreationOptions = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 3;
`;

const OptionButton = styled.button`
  background: ${props => props.active ? 
    'linear-gradient(45deg, #00aeff, #a6ff00)' : 
    'rgba(15, 15, 25, 0.95)'};
  color: white;
  padding: 12px 24px;
  border: 1px solid rgba(166, 255, 0, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(166, 255, 0, 0.2);
  }
`;

const PreviewContainer = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 400px;
  margin-left: -25px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(166, 255, 0, 0.1);
  overflow: hidden;
  box-shadow: 0 0 20px rgba(166, 255, 0, 0.1);
  clip-path: inset(0 0 0 0 round 20px);
  z-index: 2;
`;

const PlanetBuilder = () => {
  const [mode, setMode] = useState('planet'); // 'planet' or 'system'
  const [planetData, setPlanetData] = useState({
    name: '',
    size: '1',
    atmosphere: 'earth-like',
    temperature: '20',
    water: '70',
    land: '30'
  });
  
  const [systemData, setSystemData] = useState({
    name: '',
    starType: 'yellow-dwarf',
    planetCount: 1,
    planets: []
  });
  
  const [showCongrats, setShowCongrats] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'range' ? parseFloat(e.target.value) : e.target.value;
    setPlanetData(prev => ({
      ...prev,
      [e.target.name]: value,
      ...(e.target.name === 'water' ? { land: (100 - value).toString() } : {}),
      ...(e.target.name === 'land' ? { water: (100 - value).toString() } : {})
    }));
  };

  const handleSystemChange = (e) => {
    const value = e.target.type === 'range' ? parseFloat(e.target.value) : e.target.value;
    setSystemData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const getAtmosphereDescription = (type) => {
    switch(type) {
      case 'none': return 'no atmosphere';
      case 'thin': return 'a thin atmosphere';
      case 'thick': return 'a thick atmosphere';
      default: return 'an Earth-like atmosphere';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowCongrats(true);
  };

  const handleSystemSubmit = (e) => {
    e.preventDefault();
    setShowCongrats(true);
  };

  const getTemperatureDescription = (temp) => {
    const t = parseFloat(temp);
    if (t < 0) return 'freezing';
    if (t < 15) return 'cold';
    if (t < 30) return 'moderate';
    if (t < 50) return 'hot';
    return 'extremely hot';
  };

  return (
    <Layout>
      <CreationOptions>
        <OptionButton 
          active={mode === 'planet'} 
          onClick={() => setMode('planet')}
        >
          Create Planet
        </OptionButton>
        <OptionButton 
          active={mode === 'system'} 
          onClick={() => setMode('system')}
        >
          Create Solar System
        </OptionButton>
      </CreationOptions>

      <PreviewContainer>
        <Canvas 
          camera={{ position: [0, 0, 3], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          {mode === 'planet' ? (
            <Planet 
              key={`${planetData.water}-${planetData.land}-${planetData.temperature}-${planetData.atmosphere}`} 
              planetData={planetData} 
            />
          ) : (
            <SolarSystem systemData={systemData} />
          )}
          <OrbitControls 
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI * 3/4}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
          />
        </Canvas>
      </PreviewContainer>
      
      <Container>
        <Title>{mode === 'planet' ? 'Planet Builder' : 'Solar System Builder'}</Title>
        {mode === 'planet' ? (
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

            <Button type="submit" disabled={!planetData.name.trim()}>
              Create Planet
            </Button>
          </Form>
        ) : (
          <Form onSubmit={handleSystemSubmit}>
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
                <option value="red-dwarf">Red Dwarf</option>
                <option value="yellow-dwarf">Yellow Dwarf (like our Sun)</option>
                <option value="blue-giant">Blue Giant</option>
                <option value="white-dwarf">White Dwarf</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Number of Planets</Label>
              <Input
                type="range"
                name="planetCount"
                min="1"
                max="9"
                value={systemData.planetCount}
                onChange={handleSystemChange}
              />
              <span>{systemData.planetCount} planets</span>
            </FormGroup>
            <Button type="submit" disabled={!systemData.name.trim()}>
              Create Solar System
            </Button>
          </Form>
        )}
      </Container>

      {showCongrats && (
        <CongratsOverlay>
          <CongratsCard>
            <CardImage 
              src={cosmicArchitectImage}
              alt="Cosmic Architect"
            />
            <h2>Congratulations! 🎉</h2>
            {mode === 'planet' ? (
              <p>
                You've successfully created {planetData.name}! 
                This {getTemperatureDescription(planetData.temperature)} planet has {getAtmosphereDescription(planetData.atmosphere)}, 
                with {planetData.water}% water coverage and {planetData.land}% land mass.
                Its size is {planetData.size}x Earth's size.
              </p>
            ) : (
              <p>
                You've successfully created the {systemData.name} solar system! 
                This system has a {systemData.starType} star and {systemData.planetCount} planets.
              </p>
            )}
            <CloseButton onClick={() => setShowCongrats(false)}>
              Close
            </CloseButton>
          </CongratsCard>
        </CongratsOverlay>
      )}
    </Layout>
  );
};

// 3D Planet Component
const Planet = ({ planetData }) => {
  const meshRef = useRef();
  const maxSize = 1.5; 
  const actualSize = Math.min(parseFloat(planetData.size), maxSize);
  
  const [planetTexture] = useState(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    const waterPercent = parseFloat(planetData.water);
    const landPercent = parseFloat(planetData.land);
    const temp = parseFloat(planetData.temperature);
    
    // Create base water
    ctx.fillStyle = temp < 0 ? '#b0bec5' : '#1976d2';  // Ice blue or ocean blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create landmasses based on land percentage
    const createLandmass = (x, y, size, isMountain = false) => {
        const points = [];
        const segments = 24;
        
        // Create natural shape
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const radius = size * (0.7 + Math.random() * 0.6);
            points.push({
                x: x + Math.cos(angle) * radius,
                y: y + Math.sin(angle) * radius
            });
        }
        
        // Draw shape
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const xc = (points[i].x + points[i - 1].x) / 2;
            const yc = (points[i].y + points[i - 1].y) / 2;
            ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }
        ctx.closePath();
        
        // Color based on type (land or mountain)
        if (isMountain) {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, '#795548');  // Brown
            gradient.addColorStop(1, '#5d4037');  // Darker brown
            ctx.fillStyle = gradient;
        } else {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, '#2e7d32');  // Green
            gradient.addColorStop(1, '#1b5e20');  // Darker green
            ctx.fillStyle = gradient;
        }
        ctx.fill();
        
        // Add terrain detail
        for (let i = 0; i < size/4; i++) {
            const detailX = x + (Math.random() - 0.5) * size * 2;
            const detailY = y + (Math.random() - 0.5) * size * 2;
            const detailSize = 5 + Math.random() * 15;
            
            ctx.beginPath();
            ctx.arc(detailX, detailY, detailSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.1})`;
            ctx.fill();
        }
    };
    
    // Calculate landmass sizes based on land percentage
    const totalLandArea = (canvas.width * canvas.height) * (landPercent / 100);
    const numLandmasses = Math.max(2, Math.floor(landPercent / 20));
    const avgLandmassSize = Math.sqrt(totalLandArea / numLandmasses);
    
    // Create green landmasses
    for (let i = 0; i < numLandmasses; i++) {
        const x = Math.random() * canvas.width;
        const y = (canvas.height * 0.2) + Math.random() * (canvas.height * 0.6); // Keep away from poles
        const size = avgLandmassSize * (0.7 + Math.random() * 0.6);
        createLandmass(x, y, size, false);  // false = green land
    }
    
    // Add just a few brown mountain ranges (10-20% of land features)
    const numMountains = Math.max(1, Math.floor(numLandmasses * 0.15));
    for (let i = 0; i < numMountains; i++) {
        const x = Math.random() * canvas.width;
        const y = (canvas.height * 0.3) + Math.random() * (canvas.height * 0.4);
        const size = avgLandmassSize * 0.4; // Mountains are smaller
        createLandmass(x, y, size, true);  // true = brown mountains
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
    
    // Add clouds
    if (planetData.atmosphere !== 'none') {
        const cloudOpacity = planetData.atmosphere === 'thick' ? 0.4 : 0.2;
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = 20 + Math.random() * 40;
            
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
    <group scale={[actualSize, actualSize, actualSize]}>
      {/* Atmosphere glow */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={getAtmosphereColor()}
          transparent
          opacity={planetData.atmosphere === 'none' ? 0 : 0.2}
        />
      </mesh>
      
      {/* Planet surface */}
      <mesh ref={meshRef}>
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
        <mesh scale={[1.02, 1.02, 1.02]}>
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

// Add the SolarSystem component
const SolarSystem = ({ systemData }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Star */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={
            systemData.starType === 'red-dwarf' ? '#ff4444' :
            systemData.starType === 'blue-giant' ? '#4444ff' :
            systemData.starType === 'white-dwarf' ? '#ffffff' :
            '#ffff44'
          } 
          emissive={
            systemData.starType === 'red-dwarf' ? '#ff0000' :
            systemData.starType === 'blue-giant' ? '#0000ff' :
            systemData.starType === 'white-dwarf' ? '#ffffff' :
            '#ffff00'
          }
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Placeholder for planets */}
      {Array.from({ length: systemData.planetCount }).map((_, index) => (
        <mesh
          key={index}
          position={[
            Math.cos(index * ((Math.PI * 2) / systemData.planetCount)) * (index + 1),
            0,
            Math.sin(index * ((Math.PI * 2) / systemData.planetCount)) * (index + 1)
          ]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#44ff44" />
        </mesh>
      ))}
    </group>
  );
};

export default PlanetBuilder;

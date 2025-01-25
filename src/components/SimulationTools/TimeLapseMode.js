import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const Container = styled.div`
  position: fixed;
  top: 100px;
  right: 150px;
  width: 800px;
  height: calc(100vh - 150px);
  display: flex;
  justify-content: flex-end;
`;

const SimulationBox = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(15, 15, 25, 0.95);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 15px;
  padding: 1.8rem;
  color: white;
  animation: ${fadeIn} 0.5s ease-out;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const YearContainer = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(166, 255, 0, 0.1);
`;

const SimulationContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 0;
  padding: 1rem;
`;

const ControlPanel = styled.div`
  width: 100%;
  padding: 0.5rem;
  background: rgba(15, 15, 25, 0.8);
  border-radius: 10px;
  border: 1px solid rgba(166, 255, 0, 0.1);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-height: 300px;
`;

const CanvasContainer = styled.div`
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  margin-bottom: 1.5rem;

  canvas {
    &:hover {
      cursor: move;
    }
  }
`;

const YearCounter = styled.div`
  font-size: 2rem;
  color: #a6ff00;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 10px rgba(166, 255, 0, 0.5);
  background: rgba(15, 15, 25, 0.95);
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  border: 1px solid rgba(166, 255, 0, 0.2);
`;

const Timeline = styled.div`
  position: relative;
  margin: 1.5rem 0.5rem;
  height: 4px;
  background: rgba(166, 255, 0, 0.2);
  border-radius: 2px;
  margin-top: auto;
`;

const TimelineProgress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #a6ff00;
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(166, 255, 0, 0.5);
`;

const TimelineMarker = styled.div`
  position: absolute;
  top: -20px;
  left: ${props => props.position}%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const Button = styled.button`
  background: ${props => props.active ? 'linear-gradient(45deg, #00aeff, #a6ff00)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(45deg, #00aeff, #a6ff00)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const MetricValue = styled.span`
  display: inline-block;
  animation: ${pulseAnimation} 2s infinite ease-in-out;
  color: #a6ff00;
`;

const ControlButton = styled.button`
  background: rgba(166, 255, 0, 0.1);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 8px;
  color: #a6ff00;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0.5rem;

  &:hover {
    background: rgba(166, 255, 0, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(166, 255, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    margin-right: 8px;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 1px solid rgba(166, 255, 0, 0.1);
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  label {
    color: #a6ff00;
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    background: rgba(166, 255, 0, 0.1);
    border-radius: 2px;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: #a6ff00;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 0 10px rgba(166, 255, 0, 0.3);

      &:hover {
        transform: scale(1.2);
      }
    }
  }
`;

const EffectSelect = styled.select`
  background: rgba(15, 15, 25, 0.95);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 8px;
  color: #a6ff00;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  outline: none;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(166, 255, 0, 0.5);
    box-shadow: 0 0 15px rgba(166, 255, 0, 0.1);
  }

  option {
    background: rgba(15, 15, 25, 0.95);
    color: #a6ff00;
    padding: 0.5rem;
  }
`;

const MetricsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const MetricItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: rgba(166, 255, 0, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(166, 255, 0, 0.1);

  span:first-child {
    color: rgba(255, 255, 255, 0.8);
  }
`;

function AnimatedPlanet({ timeScale, selectedEffect, ref }) {
  const meshRef = useRef();
  const cloudsRef = useRef();
  const atmosphereRef = useRef();

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (meshRef.current) meshRef.current.rotation.y = 0;
      if (cloudsRef.current) cloudsRef.current.rotation.y = 0;
      if (atmosphereRef.current) atmosphereRef.current.rotation.y = 0;
    }
  }));
  
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.1 * timeScale;
    
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.15 * timeScale;
    }
    
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= delta * 0.05 * timeScale;
      atmosphereRef.current.scale.x = 1.1 + Math.sin(state.clock.elapsedTime) * 0.01;
      atmosphereRef.current.scale.y = 1.1 + Math.sin(state.clock.elapsedTime) * 0.01;
      atmosphereRef.current.scale.z = 1.1 + Math.sin(state.clock.elapsedTime) * 0.01;
    }

    switch(selectedEffect) {
      case 'climate':
        meshRef.current.material.color.setHSL(
          0.6, 
          0.7,
          0.5 + Math.sin(state.clock.elapsedTime * timeScale * 0.1) * 0.2
        );
        break;
      case 'atmosphere':
        if (atmosphereRef.current) {
          atmosphereRef.current.material.opacity = 
            0.5 + Math.sin(state.clock.elapsedTime * timeScale * 0.05) * 0.3;
        }
        break;
      case 'surface':
        const vertices = meshRef.current.geometry.attributes.position.array;
        for(let i = 0; i < vertices.length; i += 3) {
          vertices[i + 1] += Math.sin(state.clock.elapsedTime * timeScale * 0.1 + vertices[i] * 10) * 0.002;
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true;
        break;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial 
          color={new THREE.Color("#4287f5")}
          shininess={10}
          specular={new THREE.Color("#444444")}
        />
      </mesh>

      <mesh ref={cloudsRef} scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial 
          color={new THREE.Color("#ffffff")}
          transparent={true}
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={atmosphereRef} scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial 
          color={new THREE.Color("#77bbff")}
          transparent={true}
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

const ForwardedAnimatedPlanet = forwardRef((props, ref) => (
  <AnimatedPlanet {...props} ref={ref} />
));

const TimeLapseMode = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [year, setYear] = useState(2025);
  const [progress, setProgress] = useState(0);
  const [selectedEffect, setSelectedEffect] = useState('climate');
  const animationFrameRef = useRef();
  const lastUpdateTimeRef = useRef(Date.now());
  const planetRef = useRef();

  const INITIAL_YEAR = 2025;
  const FINAL_YEAR = 3025;
  const YEAR_RANGE = FINAL_YEAR - INITIAL_YEAR;

  const effects = {
    climate: {
      name: 'Climate Change',
      metrics: ['Temperature (°C)', 'Sea Level (m)', 'CO2 (ppm)']
    },
    atmosphere: {
      name: 'Atmospheric Changes',
      metrics: ['O2 Level (%)', 'Pollution Index', 'Ozone Layer (DU)']
    },
    surface: {
      name: 'Surface Evolution',
      metrics: ['Land Mass (km²)', 'Forest Cover (%)', 'Urban Area (%)']
    }
  };

  const handleReset = () => {
    // Stop any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Reset all states to initial values
    setIsPlaying(false);
    setYear(INITIAL_YEAR);
    setProgress(0);
    setTimeScale(1);
    lastUpdateTimeRef.current = Date.now();
    
    // Reset planet rotation using the ref
    if (planetRef.current) {
      planetRef.current.reset();
    }
  };

  const updateSimulation = () => {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastUpdateTimeRef.current) / 1000;
    lastUpdateTimeRef.current = currentTime;

    if (isPlaying) {
      const yearIncrement = deltaTime * timeScale * 100; // Adjust speed factor as needed
      const newYear = Math.min(year + yearIncrement, FINAL_YEAR);
      const newProgress = ((newYear - INITIAL_YEAR) / YEAR_RANGE) * 100;

      if (newYear >= FINAL_YEAR) {
        setIsPlaying(false);
        setYear(FINAL_YEAR);
        setProgress(100);
      } else {
        setYear(newYear);
        setProgress(newProgress);
        animationFrameRef.current = requestAnimationFrame(updateSimulation);
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      lastUpdateTimeRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(updateSimulation);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const formatYear = (year) => Math.floor(year).toString();

  return (
    <Container>
      <SimulationBox>
        <YearContainer>
          <YearCounter>{formatYear(year)}</YearCounter>
        </YearContainer>
        
        <SimulationContent>
          <ControlPanel>
            <ControlGroup>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <ControlButton onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </ControlButton>
                <ControlButton onClick={handleReset}>
                  ⟲ Reset
                </ControlButton>
              </div>
            </ControlGroup>
            
            <ControlGroup>
              <SliderContainer>
                <label>
                  Speed Control
                  <span>{timeScale}x</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={timeScale}
                  onChange={(e) => setTimeScale(Number(e.target.value))}
                />
              </SliderContainer>
            </ControlGroup>

            <ControlGroup>
              <label style={{ color: '#a6ff00', marginBottom: '0.5rem' }}>Effect Type</label>
              <EffectSelect 
                value={selectedEffect}
                onChange={(e) => setSelectedEffect(e.target.value)}
              >
                {Object.entries(effects).map(([key, effect]) => (
                  <option key={key} value={key}>
                    {effect.name}
                  </option>
                ))}
              </EffectSelect>
            </ControlGroup>

            <MetricsContainer>
              {effects[selectedEffect].metrics.map((metric, index) => (
                <MetricItem key={index}>
                  <span>{metric}</span>
                  <MetricValue>{Math.random().toFixed(2)}</MetricValue>
                </MetricItem>
              ))}
            </MetricsContainer>
          </ControlPanel>

          <CanvasContainer>
            <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              <ForwardedAnimatedPlanet 
                ref={planetRef}
                timeScale={timeScale} 
                selectedEffect={selectedEffect} 
              />
              <OrbitControls 
                enableZoom={true}
                minDistance={2}
                maxDistance={5}
                autoRotate={true}
                autoRotateSpeed={0.5 * timeScale}
              />
            </Canvas>
          </CanvasContainer>
        </SimulationContent>

        <Timeline>
          <TimelineProgress progress={progress} />
          <TimelineMarker position={0}>2025</TimelineMarker>
          <TimelineMarker position={25}>2275</TimelineMarker>
          <TimelineMarker position={50}>2525</TimelineMarker>
          <TimelineMarker position={75}>2775</TimelineMarker>
          <TimelineMarker position={100}>3025</TimelineMarker>
        </Timeline>
      </SimulationBox>
    </Container>
  );
};

export default TimeLapseMode;

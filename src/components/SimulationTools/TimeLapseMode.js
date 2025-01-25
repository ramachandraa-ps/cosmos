import React, { useState, useRef, useEffect } from 'react';
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
  z-index: 10;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  background: linear-gradient(45deg, #00aeff, #a6ff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
`;

const ControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TimeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
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

const Slider = styled.input`
  width: 100%;
  margin: 1rem 0;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #a6ff00;
`;

const SimulationMetrics = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
`;

const MetricItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
`;

const TimeLapseMode = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedEffect, setSelectedEffect] = useState('climate');

  const effects = {
    climate: {
      name: 'Climate Patterns',
      description: 'Simulate temperature and weather changes',
      metrics: ['Temperature', 'Precipitation', 'Wind Speed']
    },
    atmosphere: {
      name: 'Atmospheric Changes',
      description: 'Track atmospheric composition and density',
      metrics: ['CO2 Levels', 'Oxygen Content', 'Pressure']
    },
    surface: {
      name: 'Surface Evolution',
      description: 'Observe geological and topographical changes',
      metrics: ['Erosion Rate', 'Volcanic Activity', 'Plate Movement']
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(time => time + timeScale);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeScale]);

  return (
    <Container>
      <Title>Time-Lapse Simulation</Title>
      
      <ControlPanel>
        <TimeControl>
          <Button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </Button>
          <Button onClick={() => setCurrentTime(0)}>⟲ Reset</Button>
        </TimeControl>

        <Label>
          Time Scale: {timeScale}x
          <Slider
            type="range"
            min="1"
            max="1000"
            value={timeScale}
            onChange={(e) => setTimeScale(Number(e.target.value))}
          />
        </Label>

        <div>
          <Label>Simulation Effect</Label>
          {Object.entries(effects).map(([key, effect]) => (
            <Button
              key={key}
              active={selectedEffect === key}
              onClick={() => setSelectedEffect(key)}
              style={{ margin: '0.25rem' }}
            >
              {effect.name}
            </Button>
          ))}
        </div>

        <SimulationMetrics>
          <h3>{effects[selectedEffect].name}</h3>
          <p>{effects[selectedEffect].description}</p>
          {effects[selectedEffect].metrics.map(metric => (
            <MetricItem key={metric}>
              <span>{metric}</span>
              <span>{Math.random().toFixed(2)}</span>
            </MetricItem>
          ))}
        </SimulationMetrics>
      </ControlPanel>
    </Container>
  );
};

export default TimeLapseMode;

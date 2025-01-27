import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Container = styled.div`
  position: fixed;
  top: 100px;
  right: 70px;
  width: 400px;
  background: rgba(15, 15, 25, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(166, 255, 0, 0.1);
  color: white;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  background: linear-gradient(45deg, #00aeff, #a6ff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background: rgba(166, 255, 0, 0.1);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 8px;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(166, 255, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Timeline = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin: 1rem 0;
  position: relative;
  cursor: pointer;
`;

const TimelineProgress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #00aeff, #a6ff00);
  border-radius: 2px;
  width: ${props => props.progress}%;
`;

const TimeDisplay = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin: 1rem 0;
  font-family: 'Courier New', monospace;
`;

const EventList = styled.div`
  margin-top: 1.5rem;
`;

const Event = styled.div`
  padding: 0.5rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

// 3D Planet Component with time-based changes
const Planet = ({ position, color, size, orbitRadius, timeScale }) => {
  const meshRef = useRef();
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * timeScale;
    meshRef.current.position.x = Math.cos(time) * orbitRadius;
    meshRef.current.position.z = Math.sin(time) * orbitRadius;
    meshRef.current.rotation.y += 0.01 * timeScale;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const TimeLapse = ({ solarSystem }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeScale, setTimeScale] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentYear, setCurrentYear] = useState(2025);
  const [events, setEvents] = useState([]);

  // Simulate time passing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (0.1 * timeScale);
          if (newProgress >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return newProgress;
        });
        
        setCurrentYear(prev => prev + (0.1 * timeScale));
        
        // Random events generation
        if (Math.random() < 0.05) {
          const newEvent = generateRandomEvent(currentYear);
          setEvents(prev => [newEvent, ...prev].slice(0, 5));
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeScale]);

  const generateRandomEvent = (year) => {
    const events = [
      "Planetary alignment detected",
      "Solar flare activity increased",
      "Asteroid belt disturbance",
      "Gravitational anomaly observed",
      "Comet approaching inner system"
    ];
    return {
      time: Math.floor(year),
      description: events[Math.floor(Math.random() * events.length)]
    };
  };

  return (
    <Container>
      <Title>Time-Lapse Simulation</Title>
      
      <Controls>
        <Button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </Button>
        <Button onClick={() => setTimeScale(prev => Math.min(prev * 2, 8))}
                disabled={timeScale >= 8}>
          ⏩ Speed Up
        </Button>
        <Button onClick={() => setTimeScale(prev => Math.max(prev / 2, 0.5))}
                disabled={timeScale <= 0.5}>
          ⏪ Slow Down
        </Button>
        <Button onClick={() => {
          setProgress(0);
          setCurrentYear(2025);
          setEvents([]);
        }}>
          🔄 Reset
        </Button>
      </Controls>

      <TimeDisplay>
        Year: {Math.floor(currentYear)}
        <br />
        Speed: {timeScale}x
      </TimeDisplay>

      <Timeline onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const newProgress = (x / rect.width) * 100;
        setProgress(newProgress);
        setCurrentYear(2025 + (newProgress / 100) * 50);
      }}>
        <TimelineProgress progress={progress} />
      </Timeline>

      <EventList>
        {events.map((event, index) => (
          <Event key={index}>
            Year {event.time}: {event.description}
          </Event>
        ))}
      </EventList>
    </Container>
  );
};

export default TimeLapse;

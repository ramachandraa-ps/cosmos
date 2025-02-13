import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import PlanetBuilder from './PlanetBuilder';
import SolarSystemDesigner from './SolarSystemDesigner';
import HabitabilityAnalyzer from './HabitabilityAnalyzer';
import TimeLapseMode from '../SimulationTools/TimeLapseMode';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 174, 255, 0.5); }
  50% { box-shadow: 0 0 20px rgba(0, 174, 255, 0.8); }
  100% { box-shadow: 0 0 5px rgba(0, 174, 255, 0.5); }
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #0B0B2B, #1B1B4B);
  color: white;
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  text-align: center;
  padding: 2rem;
  position: relative;
  z-index: 2;
  animation: ${css`${floatAnimation}`} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #e0e0e0;
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ControlPanel = styled.div`
  position: fixed;
  top: 100px;
  left: 20px;
  width: 320px;
  height: calc(100vh - 140px);
  background: rgba(15, 15, 25, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 40px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 174, 255, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.37),
    inset 0 0 30px rgba(255, 255, 255, 0.05);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 174, 255, 0.3) rgba(15, 15, 25, 0.95);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(15, 15, 25, 0.95);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 174, 255, 0.3);
    border-radius: 4px;
  }
`;

const ToolSection = styled.div`
  border-bottom: 1px solid rgba(0, 174, 255, 0.1);
  padding-bottom: 0.8rem;
  &:last-child {
    border-bottom: none;
  }
`;

const CategoryTitle = styled.h2`
  font-size: 1rem;
  margin: 1rem 0 0.8rem;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ToolCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-radius: 20px;
  padding: 1.2rem;
  margin-bottom: 0.8rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 174, 255, 0.1);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.37),
    inset 0 0 30px rgba(255, 255, 255, 0.05);
  word-wrap: break-word;
  white-space: normal;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 174, 255, 0.3);
    box-shadow: 0 5px 15px rgba(0, 174, 255, 0.2);
  }

  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
    background: linear-gradient(45deg, #00ffff, #ff00ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    word-wrap: break-word;
    white-space: normal;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.85rem;
    word-wrap: break-word;
    white-space: normal;
    margin-bottom: 0;
  }

  .icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const CanvasContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
`;

const ContentOverlay = styled.div`
  position: relative;
  z-index: 2;
`;

function CosmicArchitect() {
  const [activeView, setActiveView] = useState('planetBuilder');
  const [planetData, setPlanetData] = useState(null);
  const [solarSystemData, setSolarSystemData] = useState([]);

  const tools = [
    {
      id: 'planetBuilder',
      icon: '🌍',
      name: 'Planet Builder',
      description: 'Create and customize unique planets',
      section: 'creation'
    },
    {
      id: 'solarSystem',
      icon: '☀️',
      name: 'Solar System Designer',
      description: 'Design complete solar systems',
      section: 'creation'
    },
    {
      id: 'habitability',
      icon: '🌱',
      name: 'Habitability Analyzer',
      description: 'Analyze life-sustaining potential',
      section: 'analysis'
    },
    {
      id: 'timeLapse',
      icon: '⏱️',
      name: 'Time-Lapse Mode',
      description: 'Simulate planetary evolution over time',
      section: 'simulation'
    }
  ];

  const renderActiveView = () => {
    switch(activeView) {
      case 'planetBuilder':
        return <PlanetBuilder onPlanetCreate={setPlanetData} />;
      case 'solarSystem':
        return <SolarSystemDesigner onSystemCreate={setSolarSystemData} />;
      case 'habitability':
        return <HabitabilityAnalyzer planetData={planetData} />;
      case 'timeLapse':
        return <TimeLapseMode planetData={planetData} />;
      default:
        return <PlanetBuilder onPlanetCreate={setPlanetData} />;
    }
  };

  return (
    <Container>
      <CanvasContainer>
        <Canvas>
          <Stars 
            radius={300} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0.5} 
            fade
          />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </CanvasContainer>

      <ContentOverlay>
        <Header>
          <Title>Cosmic Architect</Title>
        </Header>

        <ControlPanel>
          <ToolSection>
            <CategoryTitle>Creation Tools</CategoryTitle>
            {tools
              .filter(tool => tool.section === 'creation')
              .map(tool => (
                <ToolCard
                  key={tool.id}
                  active={activeView === tool.id}
                  onClick={() => setActiveView(tool.id)}
                >
                  <div className="icon">{tool.icon}</div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                </ToolCard>
              ))}
          </ToolSection>

          <ToolSection>
            <CategoryTitle>Analysis Tools</CategoryTitle>
            {tools
              .filter(tool => tool.section === 'analysis')
              .map(tool => (
                <ToolCard
                  key={tool.id}
                  active={activeView === tool.id}
                  onClick={() => setActiveView(tool.id)}
                >
                  <div className="icon">{tool.icon}</div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                </ToolCard>
              ))}
          </ToolSection>

          <ToolSection>
            <CategoryTitle>Simulation Tools</CategoryTitle>
            {tools
              .filter(tool => tool.section === 'simulation')
              .map(tool => (
                <ToolCard
                  key={tool.id}
                  active={activeView === tool.id}
                  onClick={() => setActiveView(tool.id)}
                >
                  <div className="icon">{tool.icon}</div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                </ToolCard>
              ))}
          </ToolSection>
        </ControlPanel>

        {renderActiveView()}
      </ContentOverlay>
    </Container>
  );
}

export default CosmicArchitect;

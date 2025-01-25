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
  0% { box-shadow: 0 0 5px rgba(166, 255, 0, 0.5); }
  50% { box-shadow: 0 0 20px rgba(166, 255, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(166, 255, 0, 0.5); }
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);
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
  background: linear-gradient(45deg, #00aeff, #a6ff00);
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
  width: 300px;
  min-height: calc(100vh - 140px);
  background: rgba(15, 15, 25, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(166, 255, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ToolSection = styled.div`
  border-bottom: 1px solid rgba(166, 255, 0, 0.1);
  padding-bottom: 1rem;
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  color: #a6ff00;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  opacity: 0.8;
`;

const ToolButton = styled.button`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  background: rgba(166, 255, 0, 0.1);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${props => props.active && css`
    animation: ${pulseAnimation} 2s infinite ease-in-out,
              ${glowAnimation} 2s infinite ease-in-out;
    background: rgba(166, 255, 0, 0.2);
  `}

  &:hover {
    background: rgba(166, 255, 0, 0.2);
    transform: translateX(5px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(166, 255, 0, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const ToolIcon = styled.span`
  font-size: 1.5rem;
`;

const ToolInfo = styled.div`
  text-align: left;
  flex: 1;
`;

const ToolName = styled.div`
  font-weight: 500;
`;

const ToolDescription = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.2rem;
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
            <SectionTitle>Creation Tools</SectionTitle>
            {tools
              .filter(tool => tool.section === 'creation')
              .map(tool => (
                <ToolButton
                  key={tool.id}
                  active={activeView === tool.id}
                  onClick={() => setActiveView(tool.id)}
                >
                  <ToolIcon>{tool.icon}</ToolIcon>
                  <ToolInfo>
                    <ToolName>{tool.name}</ToolName>
                    <ToolDescription>{tool.description}</ToolDescription>
                  </ToolInfo>
                </ToolButton>
              ))}
          </ToolSection>

          <ToolSection>
            <SectionTitle>Analysis Tools</SectionTitle>
            {tools
              .filter(tool => tool.section === 'analysis')
              .map(tool => (
                <ToolButton
                  key={tool.id}
                  active={activeView === tool.id}
                  onClick={() => setActiveView(tool.id)}
                >
                  <ToolIcon>{tool.icon}</ToolIcon>
                  <ToolInfo>
                    <ToolName>{tool.name}</ToolName>
                    <ToolDescription>{tool.description}</ToolDescription>
                  </ToolInfo>
                </ToolButton>
              ))}
          </ToolSection>

          <ToolSection>
            <SectionTitle>Simulation Tools</SectionTitle>
            {tools
              .filter(tool => tool.section === 'simulation')
              .map(tool => (
                <ToolButton
                  key={tool.id}
                  active={activeView === tool.id}
                  onClick={() => setActiveView(tool.id)}
                >
                  <ToolIcon>{tool.icon}</ToolIcon>
                  <ToolInfo>
                    <ToolName>{tool.name}</ToolName>
                    <ToolDescription>{tool.description}</ToolDescription>
                  </ToolInfo>
                </ToolButton>
              ))}
          </ToolSection>
        </ControlPanel>

        {renderActiveView()}
      </ContentOverlay>
    </Container>
  );
}

export default CosmicArchitect;

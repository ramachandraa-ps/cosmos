import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, useGLTF } from "@react-three/drei";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import "./App.css";
import ChatBot from './components/ChatBot';
import SpaceMonitor from './components/SpaceMonitor';
import DeepSpace from './components/DeepSpace';
import TechHub from './components/TechHub';
import InteractionZone from './components/InteractionZone';
import CelestialChallenge from './components/CelestialChallenge';
import Webinars from './components/Webinars';
import QuizTime from './components/QuizTime';
import CategoryPage from './components/categories/CategoryPage';
import NotificationBell from './components/notifications/NotificationBell';
import Games from './components/Games';
import ConstellationConnect from './components/games/ConstellationConnect';
import CosmicArchitect from './components/CosmicArchitect';
import { useHistoricEvents } from './services/notificationService';
import AsteroidDodger from './components/games/AsteroidDodger';
import TimeTraveler from './components/games/TimeTraveler';
import PlanetBuilder from './components/CosmicArchitect/PlanetBuilder';
import HabitabilityAnalyzer from './components/CosmicArchitect/HabitabilityAnalyzer';
import cosmicArchitectImage from './assets/cosmic_architect.jpeg';

const AppContainer = styled.div`
  min-height: 100vh;
  background: url(${cosmicArchitectImage}) no-repeat center center fixed;
  background-size: cover;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
  }
`;

function AstronautModel() {
  const astronautRef = useRef();
  const { scene } = useGLTF("/astronaut_3d/scene.gltf");

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Create an elliptical orbit path
    const orbitRadius = 2;
    const orbitSpeed = 0.3;
    
    // Calculate position on elliptical path
    astronautRef.current.position.x = Math.sin(time * orbitSpeed) * orbitRadius + 2;
    astronautRef.current.position.z = (Math.cos(time * orbitSpeed) * orbitRadius * 0.5) - 1;
    astronautRef.current.position.y = Math.sin(time * 0.4) * 0.5;

    // Rotate astronaut to face movement direction
    astronautRef.current.rotation.y = -time * orbitSpeed - Math.PI / 2;
    
    // Add gentle tilting based on movement
    astronautRef.current.rotation.z = Math.sin(time * 0.4) * 0.1;
    astronautRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
  });

  return (
    <primitive
      ref={astronautRef}
      object={scene}
      position={[2, 0, -1]}
      scale={[1.8, 1.8, 1.8]} 
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}

function AppContent() {
  const navigate = useNavigate();
  const [customPlanetData, setCustomPlanetData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { events, loading } = useHistoricEvents();

  const handleCreatePlanet = () => {
    console.log('Navigating to planet builder...');
    navigate('/planet-builder', { replace: true });
  };

  const handleAnalyzeHabitability = (planetData) => {
    setCustomPlanetData(planetData);
    navigate('/', { replace: true });
  };

  return (
    <AppContainer>
      <nav className="navbar">
        <div className="nav-logo">COSMOS</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/space-monitor" className="nav-link">Space Monitor</Link>
          <Link to="/deep-space" className="nav-link">Deep Space</Link>
          <Link to="/interaction" className="nav-link">Interaction Zone</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/tech-hub" className="nav-link">Tech Hub</Link>
            <NotificationBell 
              hasNotifications={!loading && events.length > 0} 
              notifications={events}
            />
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/space-monitor" element={<SpaceMonitor />} />
        <Route path="/deep-space" element={<DeepSpace />} />
        <Route path="/tech-hub" element={<TechHub />} />
        <Route path="/interaction" element={<InteractionZone />} />
        <Route path="/celestial-challenge" element={<CelestialChallenge />} />
        <Route path="/tech-hub/:category" element={<CategoryPage />} />
        <Route path="/webinars" element={<Webinars />} />
        <Route path="/quiz-time" element={<QuizTime />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/constellation-connect" element={<ConstellationConnect />} />
        <Route path="/cosmic-architect" element={<CosmicArchitect />} />
        <Route path="/games/asteroid-dodger" element={<AsteroidDodger />} />
        <Route path="/games/time-traveler" element={<TimeTraveler />} />
        <Route 
          path="/habitability-analyzer" 
          element={
            <HabitabilityAnalyzer 
              planetData={customPlanetData}
              onCreatePlanet={handleCreatePlanet}
            />
          } 
        />
        <Route 
          path="/planet-builder" 
          element={
            <PlanetBuilder 
              onAnalyzeHabitability={handleAnalyzeHabitability}
            />
          } 
        />
        <Route path="/" element={
          <HabitabilityAnalyzer 
            planetData={customPlanetData}
            onCreatePlanet={handleCreatePlanet}
          />
        } />
      </Routes>

      {/* ChatBot Components */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </AppContainer>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

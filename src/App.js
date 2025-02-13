import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, useGLTF } from "@react-three/drei";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { FaShoppingCart } from 'react-icons/fa';
import "./App.css";
import "./firebase"; // Import Firebase initialization
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
import ProfileAvatar from './components/ProfileAvatar';
import { AuthProvider, useAuth } from './context/AuthContext';
import SpaceLessons from './components/SpaceLessons';
import CommunityHub from './components/CommunityHub';
import HostWebinar from './components/HostWebinar';
import LoginPopup from './components/LoginPopup';
import SpaceZone from './components/SpaceZone';
import StudyArea from './components/StudyArea';
import GamingArena from './components/GamingArena';
import SpaceStore from './components/SpaceStore';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user) {
    return (
      <>
        {showLoginPopup && (
          <LoginPopup 
            onClose={() => {
              setShowLoginPopup(false);
              window.history.back();
            }}
            redirectPath={location.pathname}
          />
        )}
        <div style={{ display: 'none' }}>
          {setTimeout(() => setShowLoginPopup(true), 0)}
        </div>
      </>
    );
  }

  return children;
};

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

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { events, loading } = useHistoricEvents();

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <nav className="navbar">
            <div className="nav-logo">COSMOS</div>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/space-zone" className="nav-link">Space Zone</Link>
              <Link to="/interaction" className="nav-link">Interaction Zone</Link>
              <Link to="/community" className="nav-link">Community Hub</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/store" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaShoppingCart size={20} />
                  <span>Store</span>
                </Link>
                <ProfileAvatar />
                <NotificationBell 
                  hasNotifications={!loading && events.length > 0} 
                  notifications={events}
                />
              </div>
            </div>
          </nav>

          <Routes>
            <Route path="/space-zone" element={<SpaceZone />} />
            <Route path="/space-monitor" element={<SpaceMonitor />} />
            <Route path="/deep-space" element={<DeepSpace />} />
            <Route path="/tech-hub" element={<TechHub />} />
            
            {/* Protected Routes */}
            <Route path="/interaction" element={
              <ProtectedRoute>
                <InteractionZone />
              </ProtectedRoute>
            } />
            <Route path="/interaction/study-area" element={<StudyArea />} />
            <Route path="/interaction/gaming-arena" element={<GamingArena />} />
            <Route path="/celestial-challenge" element={
              <ProtectedRoute>
                <CelestialChallenge />
              </ProtectedRoute>
            } />
            <Route path="/webinars" element={
              <ProtectedRoute>
                <Webinars />
              </ProtectedRoute>
            } />
            <Route path="/quiz-time" element={
              <ProtectedRoute>
                <QuizTime />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <CommunityHub />
              </ProtectedRoute>
            } />
            <Route path="/tech-hub/:category" element={<CategoryPage />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/constellation-connect" element={<ConstellationConnect />} />
            <Route path="/cosmic-architect" element={<CosmicArchitect />} />
            <Route path="/games/asteroid-dodger" element={<AsteroidDodger />} />
            <Route path="/games/time-traveler" element={<TimeTraveler />} />
            <Route path="/space-lessons" element={<SpaceLessons />} />
            <Route path="/host-webinar" element={<HostWebinar />} />
            <Route path="/store" element={<SpaceStore />} />

            <Route path="/" element={
              <main className="hero-section">
                <div className="hero-content">
                  <div className="subtitle">Welcome to the future</div>
                  <h1>Explore The Cosmos</h1>
                  <p>Embark on an extraordinary journey through the infinite expanse of space. 
                     Discover mysterious nebulae, traverse distant galaxies, and unlock the 
                     secrets of the universe. Your cosmic adventure begins here.</p>
                  <div className="hero-buttons">
                    <button className="explore-btn">
                      Begin Journey
                    </button>
                    <button 
                      className="chatbot-btn"
                      onClick={() => setIsChatOpen(!isChatOpen)}
                    >
                      {isChatOpen ? 'Close AI Assistant' : 'Ask AI Assistant'} 
                    </button>
                  </div>
                </div>
                
                <div className="canvas-container">
                  <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
                    <Suspense fallback={null}>
                      <ambientLight intensity={1.5} />
                      <pointLight position={[10, 10, 10]} intensity={2.5} />
                      <spotLight
                        position={[0, 5, 8]}
                        angle={0.6}
                        penumbra={0.8}
                        intensity={2}
                        castShadow
                      />
                      <Stars 
                        radius={300} 
                        depth={50} 
                        count={4000}
                        factor={4} 
                        saturation={0.5} 
                        fade 
                        speed={1}
                      />
                      <AstronautModel />
                      <OrbitControls 
                        enableZoom={false} 
                        autoRotate={false}
                        enablePan={false}
                        maxPolarAngle={Math.PI * 0.6}
                        minPolarAngle={Math.PI * 0.4}
                        enableRotate={false}
                      />
                    </Suspense>
                  </Canvas>
                </div>
              </main>
            } />
          </Routes>

          {/* ChatBot Components */}
          <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

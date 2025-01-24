import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, useGLTF } from "@react-three/drei";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import ChatBot from './components/ChatBot';
import SpaceMonitor from './components/SpaceMonitor';
import DeepSpace from './components/DeepSpace';
import TechHub from './components/TechHub';
import InteractionZone from './components/InteractionZone';
import CelestialChallenge from './components/CelestialChallenge';
import CategoryPage from './components/categories/CategoryPage';


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
      scale={[1.8, 1.8, 1.8]} // Increased size
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-logo">COSMOS</div>
          <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
            <Link to="/space-monitor" className="nav-link">Space Monitor</Link>
            <Link to="/deep-space" className="nav-link">Deep Space</Link>
            <Link to="/interaction" className="nav-link">Interaction Zone</Link>
            <Link to="/tech-hub" className="nav-link">Tech Hub</Link>
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
  );
}

export default App;

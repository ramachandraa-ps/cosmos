import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  background: linear-gradient(to bottom, #0B0B2B, #1B1B4B);
  min-height: 100vh;
  color: #ffffff;
  padding: 2rem;
`;

const Canvas = styled.canvas`
  background: #000;
  border-radius: 10px;
  cursor: pointer;
`;

const GameUI = styled.div`
  display: flex;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const GameArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoPanel = styled.div`
  width: 300px;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 10px;
  height: fit-content;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const LevelIndicator = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #00ffff;
`;

const StoryText = styled.p`
  margin: 1rem 0;
  line-height: 1.6;
  font-size: 1rem;
`;

const Button = styled.button`
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin: 1rem 0;
  width: 100%;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const CheckButton = styled(Button)`
  width: auto;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  margin: 2rem 0;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
`;

const Hint = styled.div`
  background: rgba(0, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 5px;
  margin: 1rem 0;
  border: 1px solid #00ffff;
`;

const CelebrationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const CelebrationContent = styled.div`
  text-align: center;
  color: white;
  padding: 2rem;
`;

const CelebrationTitle = styled.h2`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: scaleUp 0.5s ease-out;

  @keyframes scaleUp {
    from { transform: scale(0); }
    to { transform: scale(1); }
  }
`;

const CelebrationText = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0;
  animation: slideUp 0.5s ease-out forwards;
  animation-delay: 0.3s;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Confetti = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: confetti 1s ease-out forwards;
  opacity: 0;

  @keyframes confetti {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(${props => props.endY}px) rotate(${props => props.rotation}deg);
      opacity: 0;
    }
  }
`;

const constellationData = [
  {
    name: 'Ursa Major (Big Dipper)',
    level: 1,
    stars: [
      { x: 200, y: 200 },
      { x: 250, y: 210 },
      { x: 300, y: 220 },
      { x: 350, y: 230 },
      { x: 400, y: 260 },
      { x: 380, y: 310 },
      { x: 420, y: 340 },
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
    ],
    story: "The Great Bear constellation is one of the oldest known star patterns. In Greek mythology, it represents Callisto, who was transformed into a bear by the jealous goddess Hera.",
    connectionSteps: [
      "Connect the first star to form the dipper's cup",
      "Connect the next star to continue the cup",
      "Connect the next star to complete the cup",
      "Connect the next star to start the handle",
      "Connect the next star to continue the handle",
      "Connect the final star to complete the handle"
    ]
  },
  {
    name: 'Orion',
    level: 2,
    stars: [
      { x: 250, y: 150 },  // Betelgeuse (shoulder)
      { x: 300, y: 200 },  // Belt star 1
      { x: 350, y: 200 },  // Belt star 2
      { x: 400, y: 200 },  // Belt star 3
      { x: 450, y: 150 },  // Bellatrix (other shoulder)
      { x: 250, y: 300 },  // Left foot
      { x: 450, y: 300 },  // Right foot
    ],
    connections: [
      [0, 1], [1, 2], [2, 3], [3, 4], // Belt and shoulders
      [0, 5], [4, 6] // Legs
    ],
    story: "Orion was a mighty hunter in Greek mythology. The constellation shows him holding a shield and club, with his belt formed by three bright stars in the middle.",
    connectionSteps: [
      "Connect the left shoulder to the belt",
      "Connect the three stars to form Orion's belt",
      "Connect the right shoulder",
      "Connect the left leg",
      "Connect the right leg"
    ]
  }
];

const ConstellationConnect = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userConnections, setUserConnections] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const canvasRef = useRef(null);

  const currentConstellation = constellationData.find(c => c.level === currentLevel);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scale = window.devicePixelRatio;
    
    canvas.width = 600 * scale;
    canvas.height = 600 * scale;
    canvas.style.width = '600px';
    canvas.style.height = '600px';
    
    ctx.scale(scale, scale);
    drawConstellation();
  }, [currentLevel, userConnections, selectedStar, showHint]);

  const drawConstellation = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw hint lines if hint is shown
    if (showHint) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
      ctx.lineWidth = 4;
      currentConstellation.connections.forEach(([startIdx, endIdx]) => {
        const start = currentConstellation.stars[startIdx];
        const end = currentConstellation.stars[endIdx];
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      });
    }

    // Draw user connections
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    userConnections.forEach(([startIdx, endIdx]) => {
      const start = currentConstellation.stars[startIdx];
      const end = currentConstellation.stars[endIdx];
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    });

    // Draw stars
    currentConstellation.stars.forEach((star, index) => {
      // Draw star glow
      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 15);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Draw star
      ctx.beginPath();
      ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = selectedStar === index ? '#00ffff' : '#ffffff';
      ctx.fill();
      ctx.closePath();
    });

    // Draw line from selected star to cursor if a star is selected
    if (selectedStar !== null && canvas.mouseX && canvas.mouseY) {
      const start = currentConstellation.stars[selectedStar];
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(canvas.mouseX, canvas.mouseY);
      ctx.stroke();
    }
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.mouseX = (e.clientX - rect.left) * (canvas.width / rect.width / window.devicePixelRatio);
    canvas.mouseY = (e.clientY - rect.top) * (canvas.height / rect.height / window.devicePixelRatio);
    if (selectedStar !== null) {
      drawConstellation();
    }
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width / window.devicePixelRatio);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height / window.devicePixelRatio);

    // Find clicked star
    const clickedStarIndex = currentConstellation.stars.findIndex(star => {
      const dx = star.x - x;
      const dy = star.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    });

    if (clickedStarIndex !== -1) {
      if (selectedStar === null) {
        setSelectedStar(clickedStarIndex);
      } else {
        // Check if connection is valid
        const connection = [selectedStar, clickedStarIndex].sort();
        const isValidConnection = currentConstellation.connections.some(
          ([start, end]) => 
            (start === connection[0] && end === connection[1]) ||
            (start === connection[1] && end === connection[0])
        );

        if (isValidConnection && !userConnections.some(
          ([start, end]) => 
            (start === connection[0] && end === connection[1]) ||
            (start === connection[1] && end === connection[0])
        )) {
          setUserConnections([...userConnections, connection]);
        }
        setSelectedStar(null);
      }
    }
  };

  const checkCompletion = () => {
    const isComplete = currentConstellation.connections.every(connection => 
      userConnections.some(([start, end]) => 
        (start === connection[0] && end === connection[1]) ||
        (start === connection[1] && end === connection[0])
      )
    );

    if (isComplete) {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        if (currentLevel < constellationData.length) {
          setCurrentLevel(currentLevel + 1);
          setUserConnections([]);
        }
      }, 3000);
    } else {
      alert('Not quite right yet! Keep trying!');
    }
  };

  const resetLevel = () => {
    setUserConnections([]);
    setSelectedStar(null);
  };

  const createConfetti = () => {
    const confetti = [];
    const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0000'];
    
    for (let i = 0; i < 50; i++) {
      const left = Math.random() * window.innerWidth;
      const endY = Math.random() * window.innerHeight;
      const rotation = Math.random() * 360;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 0.5;
      
      confetti.push(
        <Confetti
          key={i}
          color={color}
          style={{
            left: `${left}px`,
            top: '-10px',
            animationDelay: `${delay}s`
          }}
          endY={endY}
          rotation={rotation}
        />
      );
    }
    return confetti;
  };

  return (
    <GameContainer>
      {showCelebration && (
        <CelebrationOverlay>
          {createConfetti()}
          <CelebrationContent>
            <CelebrationTitle>Fantastic Job!</CelebrationTitle>
            <CelebrationText>
              {currentLevel < constellationData.length 
                ? "You've mastered this constellation! Get ready for the next challenge!"
                : "You've completed all constellations! You're a true astronomer!"}
            </CelebrationText>
          </CelebrationContent>
        </CelebrationOverlay>
      )}
      <Title>Constellation Connect</Title>
      <GameUI>
        <GameArea>
          <LevelIndicator>Level {currentLevel}: {currentConstellation.name}</LevelIndicator>
          <Canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            width={600}
            height={600}
          />
          <CheckButton onClick={checkCompletion}>Check Constellation</CheckButton>
        </GameArea>
        <InfoPanel>
          <h3>The Story</h3>
          <StoryText>{currentConstellation.story}</StoryText>
          <Button onClick={() => setShowHint(!showHint)}>
            {showHint ? 'Hide Guide Lines' : 'Show Guide Lines'}
          </Button>
          <Button onClick={resetLevel}>Reset Level</Button>
        </InfoPanel>
      </GameUI>
    </GameContainer>
  );
};

export default ConstellationConnect;

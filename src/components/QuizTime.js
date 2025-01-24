import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { generateQuestions } from '../services/quizService';

const QuizContainer = styled.div`
  background: linear-gradient(to bottom, #0B0B2B, #1B1B4B);
  min-height: 100vh;
  color: #ffffff;
  padding: 6rem 2rem 2rem 2rem;
  position: relative;
  overflow: hidden;
`;

const StarField = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(1px 1px at 20px 30px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 50px 160px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 80px 120px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 110px 130px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 140px 80px, #fff, rgba(0,0,0,0));
  background-size: 200px 200px;
  animation: twinkle 5s ease-in-out infinite alternate;
  opacity: 0.5;
  z-index: 0;

  @keyframes twinkle {
    0% { opacity: 0.5; }
    100% { opacity: 0.8; }
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem;
`;

const Card = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: #00ffff;
    box-shadow: 0 12px 40px 0 rgba(0, 255, 255, 0.2);
  }
`;

const QuizCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  max-width: 800px;
  margin: 2rem auto;
`;

const Question = styled.h2`
  color: #00ffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const OptionsGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin: 1.5rem 0;
`;

const Option = styled(motion.button)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 1rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  }

  &.selected {
    border-color: #00ffff;
    background: rgba(0, 255, 255, 0.1);
  }

  &.correct {
    border-color: #00ff00;
    background: rgba(0, 255, 0, 0.1);
  }

  &.incorrect {
    border-color: #ff0000;
    background: rgba(255, 0, 0, 0.1);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 1rem 0;
  overflow: hidden;
`;

const Progress = styled.div`
  width: ${props => (props.value * 10)}%;
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #ff00ff);
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const HintButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #00ffff;
  border-radius: 15px;
  color: #00ffff;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const Hint = styled(motion.div)`
  color: #00ffff;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 10px;
`;

const BackButton = styled(motion.button)`
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin: 1rem 0;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #00ffff;
  margin: 2rem auto;
`;

const Score = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #00ffff;
  margin: 1rem 0;
`;

const difficultyLevels = ['Easy', 'Medium', 'Hard'];
const domains = [
  { name: 'Asteroids', icon: '☄️' },
  { name: 'Planets', icon: '🪐' },
  { name: 'Black Holes', icon: '🌌' },
  { name: 'Stars', icon: '⭐' },
  { name: 'Galaxies', icon: '🌀' },
  { name: 'Space Exploration', icon: '🚀' }
];

const QuizTime = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setSelectedDomain(null);
    setQuestions([]);
    setQuizComplete(false);
  };

  const handleDomainSelect = async (domain) => {
    setLoading(true);
    try {
      const generatedQuestions = await generateQuestions(domain.name, selectedLevel);
      setQuestions(generatedQuestions);
      setSelectedDomain(domain);
      setCurrentQuestion(0);
      setScore(0);
      setQuizComplete(false);
      setShowHint(false);
      setSelectedOption(null);
      setShowExplanation(false);
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    }
    setLoading(false);
  };

  const handleAnswer = (selectedIndex) => {
    if (selectedOption !== null) return; // Prevent multiple selections
    
    setSelectedOption(selectedIndex);
    const isCorrect = selectedIndex === questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowHint(false);
        setShowExplanation(false);
      } else {
        setQuizComplete(true);
        if (score < 5) {
          setTimeout(() => {
            handleDomainSelect({ ...selectedDomain, name: selectedDomain.name });
          }, 3000);
        }
      }
    }, 1500);
  };

  const handleBack = () => {
    if (quizComplete || !questions.length) {
      setSelectedDomain(null);
      setQuestions([]);
    } else if (selectedDomain) {
      setSelectedDomain(null);
      setQuestions([]);
    } else {
      setSelectedLevel(null);
    }
    setCurrentQuestion(0);
    setScore(0);
    setShowHint(false);
    setQuizComplete(false);
  };

  return (
    <QuizContainer>
      <StarField />
      <ContentWrapper>
        <Title
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Cosmic Quiz Challenge
        </Title>

        <AnimatePresence mode="wait">
          {loading && (
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}

          {!selectedLevel && !loading && (
            <Grid
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {difficultyLevels.map((level) => (
                <Card
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h2>{level}</h2>
                </Card>
              ))}
            </Grid>
          )}

          {selectedLevel && !selectedDomain && !loading && (
            <Grid
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {domains.map((domain) => (
                <Card
                  key={domain.name}
                  onClick={() => handleDomainSelect(domain)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div style={{ fontSize: '2rem' }}>{domain.icon}</div>
                  <h3>{domain.name}</h3>
                </Card>
              ))}
            </Grid>
          )}

          {selectedDomain && questions.length > 0 && !quizComplete && (
            <QuizCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ProgressBar>
                <Progress value={currentQuestion} />
              </ProgressBar>

              <Question>{questions[currentQuestion].question}</Question>

              <OptionsGrid>
                {questions[currentQuestion].options.map((option, index) => (
                  <Option
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={
                      selectedOption === null
                        ? ''
                        : selectedOption === index
                        ? index === questions[currentQuestion].correct
                          ? 'correct'
                          : 'incorrect'
                        : index === questions[currentQuestion].correct && selectedOption !== null
                        ? 'correct'
                        : ''
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={selectedOption !== null}
                  >
                    {option}
                  </Option>
                ))}
              </OptionsGrid>

              <HintButton
                onClick={() => setShowHint(!showHint)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </HintButton>

              {showHint && (
                <Hint
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {questions[currentQuestion].hint}
                </Hint>
              )}

              <Score>
                Question {currentQuestion + 1} of {questions.length} | Score: {score}
              </Score>
            </QuizCard>
          )}

          {quizComplete && (
            <QuizCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Question>Quiz Complete!</Question>
              <Score>Your Score: {score} out of {questions.length}</Score>
              {score < 5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', marginTop: '1rem' }}
                >
                  <p>Keep reaching for the stars! 🌟</p>
                  <p>Let's try again with some simpler questions...</p>
                </motion.div>
              )}
            </QuizCard>
          )}
        </AnimatePresence>

        {(selectedLevel || selectedDomain) && !loading && (
          <BackButton
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </BackButton>
        )}
      </ContentWrapper>
    </QuizContainer>
  );
};

export default QuizTime;

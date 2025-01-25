import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { searchWithGemini } from '../../../services/geminiService';
import { evaluateAchievement } from '../../../services/achievementService';
import { MASTERY_LEVELS, NEXT_EVENT_MAP } from './constants';
import { chapterQuestions } from './data/questions';

const SceneContainer = styled.div`
  position: relative;
  padding: 2rem;
  min-height: 600px;
  background-image: ${props => props.backgroundImage ? `url(${props.backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  color: white;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 0;
  }
`;

const SceneTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #fff;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const SceneDescription = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #ddd;
  position: relative;
  z-index: 1;
`;

const StoryContainer = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid rgba(0, 255, 255, 0.3);
  position: relative;
  z-index: 1;
`;

const StoryText = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #fff;
`;

const InteractionArea = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 0 0.5rem;
  justify-content: center;
  z-index: 1;
  position: relative;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0.6rem 1.2rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;

  &:hover:not(:disabled) {
    background: rgba(0, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const ObserveIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

const TalkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
  </svg>
);

const CollectIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
    <path d="M18 9h-4V5h-4v4H6v4h4v4h4v-4h4z"/>
  </svg>
);

const DialogInput = styled.div`
  display: ${props => props.show ? 'flex' : 'none'};
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 0.8rem;
  border-radius: 25px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: rgba(0, 255, 255, 0.6);
  }
`;

const SendButton = styled(ActionButton)`
  min-width: auto;
  padding: 0.8rem 1.5rem;
`;

const AchievementModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 15px;
  padding: 2rem;
  color: white;
  z-index: 10;
  min-width: 300px;
  text-align: center;
`;

const AchievementBadge = styled.div`
  font-size: 4rem;
  margin: 1rem 0;
`;

const AchievementTitle = styled.h3`
  color: #00ffff;
  margin: 0.5rem 0;
`;

const AchievementDescription = styled.p`
  color: #ddd;
  margin: 0.5rem 0;
`;

const AchievementDetails = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  text-align: left;
`;

const CloseButton = styled(ActionButton)`
  margin-top: 1rem;
`;

const UnlockMessage = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 255, 0.3);
`;

const UnlockIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

const fallAnimation = keyframes`
  0% {
    transform: translateY(-100vh);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
`;

const popAnimation = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
`;

const CelebrationEmoji = styled.div`
  position: fixed;
  font-size: 2rem;
  animation: ${fallAnimation} 2s linear;
  z-index: 1000;
  pointer-events: none;
`;

const QuizModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: white;
  width: 90%;
  max-width: 600px;
  z-index: 1000;
`;

const QuizQuestion = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #00ffff;
`;

const OptionButton = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 255, 255, 0.2);
  }
`;

const BadgeAward = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const Badge = styled.div`
  font-size: 4rem;
  margin: 1rem 0;
`;

const BadgeTitle = styled.h3`
  color: #00ffff;
  margin: 0.5rem 0;
`;

const BadgeDescription = styled.p`
  color: #aaa;
  font-size: 0.9rem;
`;

const EventScene = ({ event, onJournalEntry, onArtifactCollect, onEventUnlock }) => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [achievement, setAchievement] = useState(null);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [awardedBadge, setAwardedBadge] = useState(null);
  const [eventStats, setEventStats] = useState({
    observations: 0,
    conversations: 0,
    questions: []
  });

  const badges = {
    NOVICE: {
      emoji: '🌟',
      title: 'Novice Explorer',
      description: 'Taking your first steps into astronomical discovery'
    },
    SKILLED: {
      emoji: '🔭',
      title: 'Skilled Observer',
      description: 'Developing a deeper understanding of the cosmos'
    },
    MASTER: {
      emoji: '🌌',
      title: 'Master Astronomer',
      description: 'Achieving profound insights into the universe'
    }
  };

  const clearStory = () => {
    setStory(null);
    setShowDialog(false);
    setUserQuestion('');
  };

  useEffect(() => {
    if (celebrationEmojis.length > 0) {
      const timer = setTimeout(() => {
        setCelebrationEmojis([]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [celebrationEmojis]);

  useEffect(() => {
    // Debug logging for event changes
    console.log('Event changed:', {
      eventId: event?.id,
      title: event?.title,
      stats: eventStats
    });
  }, [event]);

  useEffect(() => {
    // Debug logging for stats changes
    console.log('Stats updated:', eventStats);
  }, [eventStats]);

  useEffect(() => {
    // Reset all state when event changes
    if (event) {
      console.log('Loading new chapter:', event.title);
      clearStory();
      setEventStats({
        observations: 0,
        conversations: 0,
        questions: []
      });
      setAchievement(null);
      setCelebrationEmojis([]);
      setShowQuiz(false);
      setQuizCompleted(false);
      setAwardedBadge(null);
      setLoading(false);
      setShowDialog(false);
      setUserQuestion('');
    }
  }, [event?.id]);

  const createCelebrationEmojis = () => {
    const emojis = ['🎉', '🎊', '⭐', '🌟', '✨'];
    const newEmojis = Array(15).fill(null).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      style: {
        left: `${Math.random() * 100}vw`,
        top: '-50px',
        animationDelay: `${Math.random() * 1}s`
      }
    }));
    setCelebrationEmojis(newEmojis);
  };

  const handleObservation = async () => {
    console.log('Starting observation...');
    clearStory(); // Clear previous story before new observation
    setLoading(true);
    try {
      const response = await searchWithGemini(
        'historical_astronomy_story',
        event.title,
        event.date
      );
      
      setStory(response.text);
      setEventStats(prev => ({
        ...prev,
        observations: prev.observations + 1
      }));
      
      onJournalEntry({
        eventId: event.id,
        type: 'observation',
        content: response.text
      });
    } catch (error) {
      console.error('Error getting story:', error);
      setStory('Error loading story. Please try again.');
    }
    setLoading(false);
  };

  const handleTalk = async () => {
    console.log('Starting conversation...');
    if (!showDialog) {
      setShowDialog(true);
      return;
    }

    clearStory(); // Clear previous story before new conversation
    setLoading(true);
    try {
      const response = await searchWithGemini(
        'historical_figure_conversation',
        event.title,
        event.date,
        userQuestion
      );
      
      setStory(response.text);
      setShowDialog(false);
      setEventStats(prev => ({
        ...prev,
        conversations: prev.conversations + 1,
        questions: [...prev.questions, userQuestion]
      }));
      setUserQuestion('');
      
      onJournalEntry({
        eventId: event.id,
        type: 'conversation',
        content: response.text,
        question: userQuestion
      });
    } catch (error) {
      console.error('Error in conversation:', error);
      setStory('Error in conversation. Please try again.');
    }
    setLoading(false);
  };

  const handleCollect = async () => {
    if (eventStats.observations === 0 || eventStats.conversations === 0) {
      return;
    }

    setLoading(true);
    try {
      // Show quiz instead of immediately collecting
      setShowQuiz(true);
    } catch (error) {
      console.error('Error in handleCollect:', error);
    }
    setLoading(false);
  };

  const handleQuizAnswer = (selectedAnswer) => {
    const currentQuestion = chapterQuestions[event.id];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    let badge;
    if (isCorrect) {
      // Award badge based on stats and correct answer
      if (eventStats.observations >= 2 && eventStats.conversations >= 2) {
        badge = badges.MASTER;
      } else if (eventStats.observations >= 1 && eventStats.conversations >= 1) {
        badge = badges.SKILLED;
      } else {
        badge = badges.NOVICE;
      }
    } else {
      badge = badges.NOVICE;
    }

    setAwardedBadge(badge);
    setQuizCompleted(true);

    // Collect artifact with badge
    onArtifactCollect({
      id: `${event.id}_achievement`,
      type: 'achievement',
      title: badge.title,
      description: badge.description,
      badge: badge.emoji,
      score: isCorrect ? 100 : 50,
      eventId: event.id
    });

    // Create celebration effect
    createCelebrationEmojis();
  };

  const handleContinue = () => {
    const nextEventId = NEXT_EVENT_MAP[event.id];
    console.log('Transitioning to next chapter:', nextEventId);

    // Reset current chapter state
    setShowQuiz(false);
    setQuizCompleted(false);
    setAwardedBadge(null);
    setAchievement(null);
    setCelebrationEmojis([]);
    clearStory();
    setEventStats({
      observations: 0,
      conversations: 0,
      questions: []
    });

    // Unlock and navigate to next event
    if (nextEventId) {
      onEventUnlock(nextEventId);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userQuestion.trim()) {
      handleTalk();
    }
  };

  const handleCloseAchievement = () => {
    setAchievement(null);
    setCelebrationEmojis([]);
    
    // If there's a next event, trigger navigation to it
    if (achievement?.score >= MASTERY_LEVELS.SKILLED.minScore) {
      const nextEventId = NEXT_EVENT_MAP[event.id];
      if (nextEventId) {
        console.log('Navigating to next event on continue:', nextEventId);
        onEventUnlock(nextEventId);
      }
    }
  };

  if (!event) {
    return (
      <SceneContainer>
        <SceneTitle>Welcome to Time Traveler</SceneTitle>
        <SceneDescription>
          Select a historical event from the timeline to begin your journey through the history of astronomy.
          Each period offers unique discoveries, conversations with historical figures, and artifacts to collect!
        </SceneDescription>
      </SceneContainer>
    );
  }

  return (
    <SceneContainer backgroundImage={event.backgroundImage}>
      {celebrationEmojis.map(({ id, emoji, style }) => (
        <CelebrationEmoji key={id} style={style}>
          {emoji}
        </CelebrationEmoji>
      ))}
      <SceneTitle>{event.title}</SceneTitle>
      <SceneDescription>{event.description}</SceneDescription>

      {story && (
        <StoryContainer>
          <StoryText>{story}</StoryText>
        </StoryContainer>
      )}

      <InteractionArea>
        <ActionButton 
          onClick={handleObservation}
          disabled={loading}
        >
          <ObserveIcon /> Observe
        </ActionButton>
        <ActionButton 
          onClick={handleTalk}
          disabled={loading}
        >
          <TalkIcon /> Talk
        </ActionButton>
        {event.artifacts && (
          <ActionButton 
            onClick={handleCollect}
            disabled={loading || !story || eventStats.observations === 0}
          >
            <CollectIcon /> Collect
          </ActionButton>
        )}
      </InteractionArea>

      <DialogInput show={showDialog}>
        <StyledInput
          type="text"
          placeholder="Ask your question..."
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <SendButton 
          onClick={handleTalk}
          disabled={loading || !userQuestion.trim()}
        >
          Send
        </SendButton>
      </DialogInput>

      {showQuiz && (
        <QuizModal>
          {!quizCompleted ? (
            <>
              <QuizQuestion>{chapterQuestions[event.id].question}</QuizQuestion>
              {chapterQuestions[event.id].options.map((option, index) => (
                <OptionButton
                  key={index}
                  onClick={() => handleQuizAnswer(option)}
                >
                  {option}
                </OptionButton>
              ))}
            </>
          ) : (
            <BadgeAward>
              <Badge>{awardedBadge.emoji}</Badge>
              <BadgeTitle>{awardedBadge.title}</BadgeTitle>
              <BadgeDescription>{awardedBadge.description}</BadgeDescription>
              <CloseButton onClick={handleContinue}>
                Continue to Next Chapter
              </CloseButton>
            </BadgeAward>
          )}
        </QuizModal>
      )}

      {achievement && (
        <AchievementModal>
          <AchievementBadge>{achievement.badge}</AchievementBadge>
          <AchievementTitle>{achievement.level}</AchievementTitle>
          <AchievementDescription>{achievement.description}</AchievementDescription>
          <AchievementDetails>
            {achievement.details && achievement.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </AchievementDetails>
          {achievement.score >= MASTERY_LEVELS.SKILLED.minScore && NEXT_EVENT_MAP[event.id] && (
            <UnlockMessage>
              <UnlockIcon>🔓</UnlockIcon>
              <p>Congratulations! You've unlocked the next event: "newton_universal_gravity"!</p>
              <p>Continue your journey through astronomical history with new discoveries.</p>
            </UnlockMessage>
          )}
          <CloseButton onClick={handleCloseAchievement}>
            Continue Exploring
          </CloseButton>
        </AchievementModal>
      )}
    </SceneContainer>
  );
};

export default EventScene;

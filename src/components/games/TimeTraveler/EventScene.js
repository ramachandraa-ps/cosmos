import React, { useState } from 'react';
import styled from 'styled-components';
import { searchWithGemini } from '../../../services/geminiService';

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

const EventScene = ({ event, onJournalEntry, onArtifactCollect }) => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');

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

  const handleObservation = async () => {
    setLoading(true);
    try {
      const response = await searchWithGemini(
        'historical_astronomy_story',
        event.title,
        event.date
      );
      
      setStory(response.text);
      
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
    if (!showDialog) {
      setShowDialog(true);
      return;
    }

    setLoading(true);
    try {
      const response = await searchWithGemini(
        'historical_figure_conversation',
        event.title,
        event.date,
        userQuestion // Pass the user's question
      );
      
      setStory(response.text);
      setShowDialog(false);
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userQuestion.trim()) {
      handleTalk();
    }
  };

  const handleCollect = async () => {
    // Placeholder for collect functionality
    console.log('Collect functionality coming soon!');
  };

  return (
    <SceneContainer backgroundImage={event.backgroundImage}>
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
            disabled={loading || !story}
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
    </SceneContainer>
  );
};

export default EventScene;

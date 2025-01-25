import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TimelineView from './TimelineView';
import EventScene from './EventScene';
import Journal from './Journal';
import ArtifactGallery from './ArtifactGallery';
import { timelineEvents } from './data/events';

const GameContainer = styled.div`
  background: linear-gradient(to bottom, #0B0B2B, #1B1B4B);
  min-height: 100vh;
  padding: 6rem 2rem 2rem 2rem;
  color: white;
`;

const InterfaceContainer = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 300px;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  padding-top: 2rem;
`;

const TimeTraveler = () => {
  const [currentEvent, setCurrentEvent] = useState(timelineEvents[0]);
  const [journal, setJournal] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [gameProgress, setGameProgress] = useState({
    unlockedEvents: ['ancient_astronomy'], // Start with first event unlocked
    completedEvents: [],
    discoveredArtifacts: []
  });

  useEffect(() => {
    // Load saved game progress from localStorage
    const savedProgress = localStorage.getItem('timeTravelerProgress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        console.log('Loading saved progress:', parsed);
        
        // Ensure at least the first event is unlocked
        const unlockedEvents = parsed.unlockedEvents || ['ancient_astronomy'];
        if (!unlockedEvents.includes('ancient_astronomy')) {
          unlockedEvents.push('ancient_astronomy');
        }
        
        setGameProgress({
          ...parsed,
          unlockedEvents
        });
        setJournal(parsed.journal || []);
        setArtifacts(parsed.artifacts || []);
        
        // Set current event to the last unlocked event
        if (unlockedEvents.length > 0) {
          const lastUnlockedEventId = unlockedEvents[unlockedEvents.length - 1];
          const lastEvent = timelineEvents.find(event => event.id === lastUnlockedEventId);
          if (lastEvent) {
            setCurrentEvent(lastEvent);
          }
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save progress whenever it changes
    localStorage.setItem('timeTravelerProgress', JSON.stringify({
      ...gameProgress,
      journal,
      artifacts
    }));
  }, [gameProgress, journal, artifacts]);

  const handleEventSelect = (event) => {
    // Only allow selecting unlocked events
    if (gameProgress.unlockedEvents.includes(event.id)) {
      console.log('Selecting event:', event.title);
      setCurrentEvent(event);
    } else {
      console.log('Event locked:', event.title);
    }
  };

  const handleJournalEntry = (entry) => {
    const newJournal = [...journal, { ...entry, timestamp: new Date().toISOString() }];
    setJournal(newJournal);
  };

  const handleArtifactCollect = (artifact) => {
    if (!gameProgress.discoveredArtifacts.includes(artifact.id)) {
      const newArtifacts = [...artifacts, artifact];
      setArtifacts(newArtifacts);
      setGameProgress(prev => ({
        ...prev,
        discoveredArtifacts: [...prev.discoveredArtifacts, artifact.id]
      }));
    }
  };

  const handleEventUnlock = (nextEventId) => {
    console.log('Handling event unlock:', {
      nextEventId,
      currentEvent: currentEvent?.id,
      unlockedEvents: gameProgress.unlockedEvents
    });

    // Mark current event as completed and unlock next event
    const newProgress = {
      ...gameProgress,
      unlockedEvents: [...new Set([...gameProgress.unlockedEvents, nextEventId])],
      completedEvents: [...new Set([...gameProgress.completedEvents, currentEvent.id])]
    };
    
    console.log('Updating game progress:', newProgress);
    setGameProgress(newProgress);

    // Find and set the next event
    const nextEvent = timelineEvents.find(event => event.id === nextEventId);
    if (nextEvent) {
      console.log('Setting next event:', nextEvent.title);
      setCurrentEvent(nextEvent);
    }

    // Save to localStorage
    localStorage.setItem('timeTravelerProgress', JSON.stringify({
      ...newProgress,
      journal,
      artifacts
    }));
  };

  return (
    <GameContainer>
      <InterfaceContainer>
        <TimelineView 
          events={timelineEvents}
          currentEvent={currentEvent}
          unlockedEvents={gameProgress.unlockedEvents}
          onEventSelect={handleEventSelect}
        />
        <EventScene 
          event={currentEvent}
          onJournalEntry={handleJournalEntry}
          onArtifactCollect={handleArtifactCollect}
          onEventUnlock={handleEventUnlock}
        />
        <Journal 
          entries={journal}
          artifacts={artifacts}
        />
      </InterfaceContainer>
    </GameContainer>
  );
};

export default TimeTraveler;

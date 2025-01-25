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
  padding: 2rem;
  color: white;
`;

const InterfaceContainer = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 300px;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
`;

const TimeTraveler = () => {
  const [currentEvent, setCurrentEvent] = useState(timelineEvents[0]);
  const [journal, setJournal] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [gameProgress, setGameProgress] = useState({
    unlockedEvents: [timelineEvents[0].id],
    completedEvents: [],
    discoveredArtifacts: []
  });

  useEffect(() => {
    // Load saved game progress from localStorage
    const savedProgress = localStorage.getItem('timeTravelerProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setGameProgress(parsed);
      setJournal(parsed.journal || []);
      setArtifacts(parsed.artifacts || []);
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
    setCurrentEvent(event);
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

  const handleEventUnlock = (completedEventId) => {
    // Find the next event in the timeline
    const currentIndex = timelineEvents.findIndex(event => event.id === completedEventId);
    const nextEvent = timelineEvents[currentIndex + 1];

    if (nextEvent && !gameProgress.unlockedEvents.includes(nextEvent.id)) {
      setGameProgress(prev => ({
        ...prev,
        unlockedEvents: [...prev.unlockedEvents, nextEvent.id],
        completedEvents: [...prev.completedEvents, completedEventId]
      }));
    }
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

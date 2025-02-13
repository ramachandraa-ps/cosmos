import React, { useState } from 'react';
import styled from 'styled-components';

const JournalContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 1rem;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
`;

const JournalTabs = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tab = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: ${props => props.active ? '#00ffff' : '#fff'};
  border-bottom: 2px solid ${props => props.active ? '#00ffff' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: #00ffff;
  }
`;

const JournalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

const JournalEntry = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const EntryTimestamp = styled.div`
  font-size: 0.8rem;
  color: #00ffff;
  margin-bottom: 0.5rem;
`;

const EntryText = styled.div`
  color: #fff;
  line-height: 1.4;
`;

const ArtifactCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ArtifactName = styled.h4`
  color: #00ffff;
  margin: 0 0 0.5rem 0;
`;

const ArtifactDescription = styled.p`
  color: #ddd;
  font-size: 0.9rem;
  margin: 0;
`;

const Journal = ({ entries, artifacts }) => {
  const [activeTab, setActiveTab] = useState('entries');

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <JournalContainer>
      <JournalTabs>
        <Tab 
          active={activeTab === 'entries'} 
          onClick={() => setActiveTab('entries')}
        >
          Journal
        </Tab>
        <Tab 
          active={activeTab === 'artifacts'} 
          onClick={() => setActiveTab('artifacts')}
        >
          Artifacts
        </Tab>
      </JournalTabs>

      <JournalContent>
        {activeTab === 'entries' ? (
          entries.map((entry, index) => (
            <JournalEntry key={index}>
              <EntryTimestamp>{formatDate(entry.timestamp)}</EntryTimestamp>
              <EntryText>{entry.discovery}</EntryText>
            </JournalEntry>
          ))
        ) : (
          artifacts.map((artifact, index) => (
            <ArtifactCard key={index}>
              <ArtifactName>{artifact.name}</ArtifactName>
              <ArtifactDescription>{artifact.description}</ArtifactDescription>
            </ArtifactCard>
          ))
        )}
      </JournalContent>
    </JournalContainer>
  );
};

export default Journal;

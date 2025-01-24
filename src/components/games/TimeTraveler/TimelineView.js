import React from 'react';
import styled from 'styled-components';

const TimelineContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
`;

const TimelineEvent = styled.div`
  background: ${props => props.isSelected ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: ${props => props.isLocked ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.isLocked ? 0.5 : 1};
  border: 1px solid ${props => props.isSelected ? '#00ffff' : 'rgba(255, 255, 255, 0.1)'};
  transition: all 0.3s ease;

  &:hover {
    transform: ${props => props.isLocked ? 'none' : 'translateX(5px)'};
    background: ${props => props.isLocked ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 255, 255, 0.1)'};
  }
`;

const EventTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  color: ${props => props.isLocked ? '#888' : '#fff'};
`;

const EventDate = styled.div`
  font-size: 0.8rem;
  color: ${props => props.isLocked ? '#666' : '#00ffff'};
`;

const TimelineView = ({ events, currentEvent, unlockedEvents, onEventSelect }) => {
  return (
    <TimelineContainer>
      {events.map(event => {
        const isLocked = !unlockedEvents.includes(event.id);
        const isSelected = currentEvent?.id === event.id;

        return (
          <TimelineEvent
            key={event.id}
            isLocked={isLocked}
            isSelected={isSelected}
            onClick={() => !isLocked && onEventSelect(event)}
          >
            <EventTitle isLocked={isLocked}>{event.title}</EventTitle>
            <EventDate isLocked={isLocked}>{event.date}</EventDate>
          </TimelineEvent>
        );
      })}
    </TimelineContainer>
  );
};

export default TimelineView;

import React from 'react';
import styled from 'styled-components';

const ItemContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1.2rem;
  transition: transform 0.2s ease;
  border: 1px solid rgba(166, 255, 0, 0.1);

  &:hover {
    transform: translateX(5px);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ItemTitle = styled.h4`
  color: #a6ff00;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const ItemDate = styled.div`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
`;

const ItemDescription = styled.p`
  color: #e0e0e0;
  margin: 0;
  line-height: 1.5;
  font-size: 1rem;
`;

const NotificationItem = ({ title, date, description }) => {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ItemContainer>
      <ItemTitle>{title}</ItemTitle>
      <ItemDate>{formatDate(date)}</ItemDate>
      <ItemDescription>{description}</ItemDescription>
    </ItemContainer>
  );
};

export default NotificationItem;

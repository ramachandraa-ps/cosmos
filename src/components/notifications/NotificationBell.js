import React, { useState } from 'react';
import styled from 'styled-components';
import { FaBell } from 'react-icons/fa';
import NotificationItem from './NotificationItem';

const NotificationContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 1rem;
`;

const BellIcon = styled.div`
  cursor: pointer;
  padding: 8px;
  color: white;
  font-size: 1.5rem;
  transition: transform 0.2s ease;
  margin-left: 0.5rem;

  &:hover {
    transform: scale(1.1);
    color: #a6ff00;
  }
`;

const NotificationDot = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  background-color: #ff4444;
  border-radius: 50%;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const NotificationPanel = styled.div`
  position: absolute;
  top: 100%;
  right: -100px;
  width: 400px;
  max-height: 500px;
  background: rgba(15, 15, 25, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 1.5rem;
  margin-top: 15px;
  z-index: 1000;
  overflow-y: auto;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transform: translateY(${props => props.isVisible ? '0' : '-20px'});
  transition: all 0.3s ease;
  border: 1px solid rgba(166, 255, 0, 0.1);

  &:before {
    content: '';
    position: absolute;
    top: -6px;
    right: 110px;
    width: 12px;
    height: 12px;
    background: rgba(15, 15, 25, 0.95);
    transform: rotate(45deg);
    border-left: 1px solid rgba(166, 255, 0, 0.1);
    border-top: 1px solid rgba(166, 255, 0, 0.1);
  }
`;

const NotificationTitle = styled.h3`
  color: #a6ff00;
  margin: 0 0 1rem 0;
  font-size: 1.4rem;
  border-bottom: 1px solid rgba(166, 255, 0, 0.2);
  padding-bottom: 0.8rem;
  text-align: center;
`;

const EmptyMessage = styled.div`
  color: #e0e0e0;
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  font-size: 1.1rem;
  line-height: 1.6;

  .date {
    color: #a6ff00;
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotificationBell = ({ hasNotifications = false, notifications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const today = formatDate(new Date());

  return (
    <NotificationContainer className="notification-container">
      <BellIcon onClick={toggleNotifications} className="bell-icon">
        <FaBell />
        {hasNotifications && <NotificationDot className="notification-dot" />}
      </BellIcon>
      <NotificationPanel isVisible={isOpen} className="notification-panel">
        <NotificationTitle>Space History Today</NotificationTitle>
        {notifications.length === 0 ? (
          <EmptyMessage>
            <span className="date">{today}</span>
            No historic space events occurred on this day.
          </EmptyMessage>
        ) : (
          <NotificationList>
            {notifications.map((notification, index) => (
              <NotificationItem
                key={index}
                title={notification.title}
                date={notification.date}
                description={notification.description}
              />
            ))}
          </NotificationList>
        )}
      </NotificationPanel>
    </NotificationContainer>
  );
};

export default NotificationBell;

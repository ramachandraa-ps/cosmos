import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const WebinarsContainer = styled.div`
  background: linear-gradient(to bottom, #0B0B2B, #1B1B4B);
  min-height: 100vh;
  color: #ffffff;
  padding: 6rem 2rem 2rem 2rem;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Inter', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const WebinarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const WebinarCard = styled(motion.div)`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-radius: 15px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
`;

const WebinarTitle = styled.h3`
  color: #00ffff;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
`;

const WebinarInfo = styled.p`
  color: #ffffff;
  margin: 0.5rem 0;
  font-size: 1rem;
  opacity: 0.9;
`;

const WebinarDate = styled.div`
  color: #ff00ff;
  font-weight: bold;
  margin-top: 1rem;
`;

const RegisterButton = styled(motion.button)`
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  transition: transform 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const Webinars = () => {
  const webinarsList = [
    {
      id: 1,
      title: "Exploring Mars: Latest Discoveries",
      speaker: "Dr. Sarah Johnson",
      date: "February 15, 2025",
      time: "10:00 AM EST",
      duration: "90 minutes",
      description: "Join us for an exciting discussion about recent Mars discoveries and future exploration plans."
    },
    {
      id: 2,
      title: "Black Holes: Understanding the Unknown",
      speaker: "Prof. Michael Chen",
      date: "February 20, 2025",
      time: "2:00 PM EST",
      duration: "60 minutes",
      description: "Dive deep into the mysteries of black holes and their role in shaping our universe."
    },
    {
      id: 3,
      title: "Space Tourism: The Future is Now",
      speaker: "Emma Rodriguez",
      date: "March 1, 2025",
      time: "11:00 AM EST",
      duration: "75 minutes",
      description: "Explore the emerging industry of space tourism and its potential impact on future space travel."
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <WebinarsContainer>
      <Title>Upcoming Space Webinars</Title>
      <WebinarGrid>
        {webinarsList.map((webinar, index) => (
          <WebinarCard
            key={webinar.id}
            as={motion.div}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <WebinarTitle>{webinar.title}</WebinarTitle>
            <WebinarInfo>Speaker: {webinar.speaker}</WebinarInfo>
            <WebinarInfo>Duration: {webinar.duration}</WebinarInfo>
            <WebinarInfo>{webinar.description}</WebinarInfo>
            <WebinarDate>{webinar.date} at {webinar.time}</WebinarDate>
            <RegisterButton
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Register Now
            </RegisterButton>
          </WebinarCard>
        ))}
      </WebinarGrid>
    </WebinarsContainer>
  );
};

export default Webinars;

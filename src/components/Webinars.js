import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const NoWebinarsContainer = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const NoWebinarsTitle = styled.h2`
  color: #00ffff;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
`;

const NoWebinarsText = styled.p`
  color: #ffffff;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const BottomSection = styled.div`
  text-align: center;
  margin: 3rem auto;
  padding: 2rem;
  max-width: 600px;
`;

const BottomText = styled.p`
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
`;

const HostButton = styled(motion.button)`
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 255, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Requirements = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Webinars = () => {
  const [webinars, setWebinars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch webinars from localStorage
    const storedWebinars = JSON.parse(localStorage.getItem('webinars') || '[]');
    setWebinars(storedWebinars);
  }, []);

  const handleHostWebinar = () => {
    navigate('/host-webinar');
  };

  const handleRegister = (registrationLink) => {
    window.open(registrationLink, '_blank');
  };

  return (
    <WebinarsContainer>
      <Title>Webinars</Title>
      
      {webinars.length === 0 ? (
        <NoWebinarsContainer>
          <NoWebinarsTitle>No Webinars Available</NoWebinarsTitle>
          <NoWebinarsText>
            Share your cosmic knowledge and inspire fellow space enthusiasts! 
            Host a webinar to explain your innovations, discoveries, and insights 
            to our community of eager learners.
          </NoWebinarsText>
          <HostButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHostWebinar}
          >
            Host a Webinar
          </HostButton>
        </NoWebinarsContainer>
      ) : (
        <>
          <WebinarGrid>
            {webinars.map(webinar => (
              <WebinarCard
                key={webinar.id}
                as={motion.div}
                whileHover={{ scale: 1.02 }}
              >
                <WebinarTitle>{webinar.title}</WebinarTitle>
                <WebinarInfo>Host: {webinar.hostName}</WebinarInfo>
                <WebinarInfo>Duration: {webinar.duration} minutes</WebinarInfo>
                <WebinarInfo>{webinar.description}</WebinarInfo>
                <WebinarDate>{webinar.date} at {webinar.time}</WebinarDate>
                
                {webinar.requirements && (
                  <Requirements>
                    <WebinarInfo style={{ color: '#00ffff' }}>Requirements:</WebinarInfo>
                    <WebinarInfo>{webinar.requirements}</WebinarInfo>
                  </Requirements>
                )}
                
                {webinar.maxParticipants && (
                  <WebinarInfo>
                    Maximum Participants: {webinar.maxParticipants}
                  </WebinarInfo>
                )}
                
                <RegisterButton
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRegister(webinar.registrationLink)}
                >
                  Register Now
                </RegisterButton>
              </WebinarCard>
            ))}
          </WebinarGrid>

          <BottomSection>
            <BottomText>
              Have knowledge to share? Host your own webinar and join our community of space educators!
            </BottomText>
            <HostButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHostWebinar}
            >
              Host a Webinar
            </HostButton>
          </BottomSection>
        </>
      )}
    </WebinarsContainer>
  );
};

export default Webinars;

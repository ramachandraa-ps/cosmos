import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HostWebinarContainer = styled.div`
  background: linear-gradient(to bottom, #0B0B2B, #1B1B4B);
  min-height: 100vh;
  color: #ffffff;
  padding: 6rem 2rem 2rem 2rem;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Inter', sans-serif;
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #00ffff;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.8rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.8rem;
  color: white;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #00ffff, #ff00ff);
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
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

const ErrorMessage = styled.div`
  color: #ff4d4d;
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

const HostWebinar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    hostName: '',
    date: '',
    time: '',
    duration: '',
    description: '',
    registrationLink: '',
    requirements: '',
    maxParticipants: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.hostName) newErrors.hostName = 'Host name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.registrationLink) newErrors.registrationLink = 'Registration link is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Add the webinar to the list
      const newWebinar = {
        id: Date.now(),
        ...formData
      };
      
      // Here you would typically make an API call to save the webinar
      // For now, we'll store it in localStorage
      const existingWebinars = JSON.parse(localStorage.getItem('webinars') || '[]');
      localStorage.setItem('webinars', JSON.stringify([...existingWebinars, newWebinar]));
      
      // Navigate back to webinars page
      navigate('/webinars');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <HostWebinarContainer>
      <Title>Host a Webinar</Title>
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Webinar Title</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter webinar title"
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Host Name</Label>
            <Input
              type="text"
              name="hostName"
              value={formData.hostName}
              onChange={handleChange}
              placeholder="Enter host name"
            />
            {errors.hostName && <ErrorMessage>{errors.hostName}</ErrorMessage>}
          </FormGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormGroup>
              <Label>Date</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
            </FormGroup>

            <FormGroup>
              <Label>Time</Label>
              <Input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />
              {errors.time && <ErrorMessage>{errors.time}</ErrorMessage>}
            </FormGroup>
          </div>

          <FormGroup>
            <Label>Duration (in minutes)</Label>
            <Input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 60"
              min="15"
              max="180"
            />
            {errors.duration && <ErrorMessage>{errors.duration}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter webinar description"
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Registration Link</Label>
            <Input
              type="url"
              name="registrationLink"
              value={formData.registrationLink}
              onChange={handleChange}
              placeholder="Enter registration link"
            />
            {errors.registrationLink && <ErrorMessage>{errors.registrationLink}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Requirements (Optional)</Label>
            <TextArea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Enter any special requirements for participants"
            />
          </FormGroup>

          <FormGroup>
            <Label>Maximum Participants (Optional)</Label>
            <Input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              placeholder="Enter maximum number of participants"
              min="1"
            />
          </FormGroup>

          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Webinar
          </SubmitButton>
        </Form>
      </FormContainer>
    </HostWebinarContainer>
  );
};

export default HostWebinar;

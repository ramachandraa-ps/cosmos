import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  top: 100px;
  right: 20px;
  width: 400px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(166, 255, 0, 0.1);
  color: white;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  background: linear-gradient(45deg, #00aeff, #a6ff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #a6ff00;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 5px;
  padding: 0.5rem;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #a6ff00;
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 5px;
  padding: 0.5rem;
  color: white;
  font-size: 1rem;

  option {
    background: #24243e;
  }
`;

const Button = styled.button`
  background: linear-gradient(45deg, #00aeff, #a6ff00);
  border: none;
  border-radius: 5px;
  padding: 0.8rem;
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

function PlanetBuilder() {
  const [planetData, setPlanetData] = useState({
    name: '',
    size: '1',
    atmosphere: 'earth-like',
    gravity: '1',
    temperature: '20',
    water: '70'
  });

  const handleChange = (e) => {
    setPlanetData({
      ...planetData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we'll add the planet creation logic
    console.log('Creating planet:', planetData);
  };

  return (
    <Container>
      <Title>Planet Builder</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Planet Name</Label>
          <Input
            type="text"
            name="name"
            value={planetData.name}
            onChange={handleChange}
            placeholder="Enter planet name"
          />
        </FormGroup>

        <FormGroup>
          <Label>Size (Earth radius)</Label>
          <Input
            type="number"
            name="size"
            value={planetData.size}
            onChange={handleChange}
            min="0.1"
            max="10"
            step="0.1"
          />
        </FormGroup>

        <FormGroup>
          <Label>Atmosphere Type</Label>
          <Select name="atmosphere" value={planetData.atmosphere} onChange={handleChange}>
            <option value="earth-like">Earth-like</option>
            <option value="thick">Thick (Venus-like)</option>
            <option value="thin">Thin (Mars-like)</option>
            <option value="none">None</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Surface Gravity (g)</Label>
          <Input
            type="number"
            name="gravity"
            value={planetData.gravity}
            onChange={handleChange}
            min="0.1"
            max="5"
            step="0.1"
          />
        </FormGroup>

        <FormGroup>
          <Label>Average Temperature (°C)</Label>
          <Input
            type="number"
            name="temperature"
            value={planetData.temperature}
            onChange={handleChange}
            min="-100"
            max="100"
          />
        </FormGroup>

        <FormGroup>
          <Label>Water Coverage (%)</Label>
          <Input
            type="number"
            name="water"
            value={planetData.water}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </FormGroup>

        <Button type="submit">Create Planet</Button>
      </Form>
    </Container>
  );
}

export default PlanetBuilder;

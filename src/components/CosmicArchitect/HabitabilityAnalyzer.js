import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  top: 100px;
  right: 20px;
  width: 400px;
  background: rgba(15, 15, 25, 0.95);
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

const AnalysisSection = styled.div`
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 0.5rem 0;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.value}%;
    background: ${props => props.color || '#a6ff00'};
    border-radius: 4px;
    transition: width 0.5s ease;
  }
`;

const Parameter = styled.div`
  margin: 1rem 0;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
  color: #ddd;
`;

const Value = styled.span`
  color: ${props => props.color || '#a6ff00'};
`;

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 2rem;
  border: 1px solid rgba(166, 255, 0, 0.1);
`;

const ResultTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 1rem;
`;

const ResultText = styled.p`
  margin: 0;
  color: #ddd;
  line-height: 1.5;
`;

const RecommendationList = styled.ul`
  margin: 1rem 0;
  padding-left: 1.2rem;
  color: #ddd;

  li {
    margin: 0.5rem 0;
  }
`;

const HabitabilityAnalyzer = ({ planetData }) => {
  const [analysis, setAnalysis] = useState({
    temperature: 75,
    atmosphere: 85,
    gravity: 95,
    radiation: 60,
    water: 80
  });

  const getColorForValue = (value) => {
    if (value >= 80) return '#a6ff00';
    if (value >= 60) return '#ffd000';
    return '#ff4040';
  };

  const getHabitabilityScore = () => {
    const values = Object.values(analysis);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  const getRecommendations = () => {
    const recommendations = [];
    if (analysis.temperature < 70) recommendations.push('Consider adjusting orbital distance for optimal temperature');
    if (analysis.atmosphere < 70) recommendations.push('Atmospheric composition needs enhancement');
    if (analysis.radiation > 40) recommendations.push('Additional magnetic field protection recommended');
    if (analysis.water < 70) recommendations.push('Increase water content for better habitability');
    return recommendations;
  };

  return (
    <Container>
      <Title>Habitability Analyzer</Title>
      
      <AnalysisSection>
        <Parameter>
          <Label>
            Temperature Balance
            <Value color={getColorForValue(analysis.temperature)}>
              {analysis.temperature}%
            </Value>
          </Label>
          <ProgressBar value={analysis.temperature} color={getColorForValue(analysis.temperature)} />
        </Parameter>

        <Parameter>
          <Label>
            Atmospheric Composition
            <Value color={getColorForValue(analysis.atmosphere)}>
              {analysis.atmosphere}%
            </Value>
          </Label>
          <ProgressBar value={analysis.atmosphere} color={getColorForValue(analysis.atmosphere)} />
        </Parameter>

        <Parameter>
          <Label>
            Gravity Conditions
            <Value color={getColorForValue(analysis.gravity)}>
              {analysis.gravity}%
            </Value>
          </Label>
          <ProgressBar value={analysis.gravity} color={getColorForValue(analysis.gravity)} />
        </Parameter>

        <Parameter>
          <Label>
            Radiation Protection
            <Value color={getColorForValue(analysis.radiation)}>
              {analysis.radiation}%
            </Value>
          </Label>
          <ProgressBar value={analysis.radiation} color={getColorForValue(analysis.radiation)} />
        </Parameter>

        <Parameter>
          <Label>
            Water Availability
            <Value color={getColorForValue(analysis.water)}>
              {analysis.water}%
            </Value>
          </Label>
          <ProgressBar value={analysis.water} color={getColorForValue(analysis.water)} />
        </Parameter>
      </AnalysisSection>

      <ResultCard>
        <ResultTitle>Habitability Score: {getHabitabilityScore()}%</ResultTitle>
        <ResultText>
          This planet shows {getHabitabilityScore() >= 80 ? 'excellent' : getHabitabilityScore() >= 60 ? 'moderate' : 'challenging'} potential for habitability.
        </ResultText>
        <RecommendationList>
          {getRecommendations().map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </RecommendationList>
      </ResultCard>
    </Container>
  );
};

export default HabitabilityAnalyzer;

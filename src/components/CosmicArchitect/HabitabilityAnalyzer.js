import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Planet } from './PlanetBuilder';  // Reusing the Planet component

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
  max-height: 80vh;
  overflow-y: auto;
  z-index: 10;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(166, 255, 0, 0.3);
    border-radius: 4px;
  }
`;

const VisualizationCard = styled.div`
  position: fixed;
  top: 100px;
  left: 350px;
  width: calc(100% - 820px);
  height: calc(100vh - 140px);
  background: rgba(15, 15, 25, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(166, 255, 0, 0.1);
  overflow: hidden;
  z-index: 2;
`;

const Title = styled.h2`
  background: linear-gradient(45deg, #00aeff, #a6ff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(166, 255, 0, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #a6ff00;
  }
`;

const PlanetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PlanetCard = styled.div`
  background: ${props => props.selected ? 'rgba(166, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.selected ? '#a6ff00' : 'transparent'};

  &:hover {
    transform: translateY(-2px);
    background: rgba(166, 255, 0, 0.1);
  }
`;

const CreatePlanetCard = styled(PlanetCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  background: rgba(166, 255, 0, 0.1);
  border: 2px dashed rgba(166, 255, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(166, 255, 0, 0.2);
    border-color: rgba(166, 255, 0, 0.5);
    transform: translateY(-2px);
  }

  h3 {
    color: #a6ff00;
    margin-bottom: 0.5rem;
  }

  p {
    text-align: center;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const AnalysisSection = styled.div`
  margin-bottom: 2rem;
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

const RecommendationCard = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid rgba(166, 255, 0, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
`;

const ComparisonCard = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid rgba(166, 255, 0, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
`;

const ComparisonItem = styled.div`
  margin-bottom: 1rem;
`;

const ComparisonBar = styled.div`
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
    background: ${props => props.type === 'temperature' ? '#ff4040' : '#a6ff00'};
    border-radius: 4px;
    transition: width 0.5s ease;
  }
`;

// Solar System Planet Data
const solarSystemPlanets = {
  mercury: {
    name: 'Mercury',
    size: 0.383,
    atmosphere: 'none',
    temperature: 167,
    water: 0,
    land: 100,
    gravity: 0.378,
    magneticField: 0.01,
    surfaceRadiation: 'extreme',
    description: 'Closest planet to the Sun, extremely hot during day and cold at night.'
  },
  venus: {
    name: 'Venus',
    size: 0.949,
    atmosphere: 'thick',
    temperature: 464,
    water: 0,
    land: 100,
    gravity: 0.907,
    magneticField: 0.000001,
    surfaceRadiation: 'high',
    description: 'Often called Earth\'s sister planet, but extremely hot with a toxic atmosphere.'
  },
  earth: {
    name: 'Earth',
    size: 1,
    atmosphere: 'earth-like',
    temperature: 15,
    water: 71,
    land: 29,
    gravity: 1,
    magneticField: 1,
    surfaceRadiation: 'moderate',
    description: 'Our home planet, the only known planet with confirmed life.'
  },
  mars: {
    name: 'Mars',
    size: 0.532,
    atmosphere: 'thin',
    temperature: -63,
    water: 0,
    land: 100,
    gravity: 0.377,
    magneticField: 0.0001,
    surfaceRadiation: 'high',
    description: 'The Red Planet, with potential for future human colonization.'
  },
  jupiter: {
    name: 'Jupiter',
    size: 11.209,
    atmosphere: 'thick',
    temperature: -110,
    water: 0,
    land: 0,
    gravity: 2.528,
    magneticField: 14,
    surfaceRadiation: 'extreme',
    description: 'The largest planet in our solar system, a gas giant.'
  },
  saturn: {
    name: 'Saturn',
    size: 9.449,
    atmosphere: 'thick',
    temperature: -140,
    water: 0,
    land: 0,
    gravity: 1.065,
    magneticField: 0.6,
    surfaceRadiation: 'extreme',
    description: 'Known for its beautiful rings, another gas giant.'
  },
  uranus: {
    name: 'Uranus',
    size: 4.007,
    atmosphere: 'thick',
    temperature: -195,
    water: 0,
    land: 0,
    gravity: 0.886,
    magneticField: 0.228,
    surfaceRadiation: 'high',
    description: 'An ice giant with a unique tilted rotation.'
  },
  neptune: {
    name: 'Neptune',
    size: 3.883,
    atmosphere: 'thick',
    temperature: -200,
    water: 0,
    land: 0,
    gravity: 1.137,
    magneticField: 0.142,
    surfaceRadiation: 'high',
    description: 'The windiest planet, with the strongest storms in the solar system.'
  }
};

const HabitabilityAnalyzer = ({ planetData: customPlanetData, onCreatePlanet }) => {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (customPlanetData) {
      setSelectedPlanet({ ...customPlanetData, isCustom: true });
    }
  }, [customPlanetData]);

  useEffect(() => {
    if (selectedPlanet) {
      const temperatureScore = calculateTemperatureScore(selectedPlanet.temperature);
      const atmosphereScore = calculateAtmosphereScore(selectedPlanet.atmosphere);
      const gravityScore = calculateGravityScore(selectedPlanet.gravity);
      const waterScore = calculateWaterScore(selectedPlanet.water);
      const radiationScore = calculateRadiationScore(selectedPlanet.atmosphere, selectedPlanet.gravity, selectedPlanet.magneticField);

      setAnalysis({
        temperature: temperatureScore,
        atmosphere: atmosphereScore,
        gravity: gravityScore,
        radiation: radiationScore,
        water: waterScore
      });
    }
  }, [selectedPlanet]);

  const calculateTemperatureScore = (temp) => {
    const optimalMin = -20;
    const optimalMax = 50;
    const extremeMin = -50;
    const extremeMax = 80;
    
    if (temp >= optimalMin && temp <= optimalMax) {
      return 100;
    } else if (temp < extremeMin || temp > extremeMax) {
      return 0;
    } else if (temp < optimalMin) {
      return ((temp - extremeMin) / (optimalMin - extremeMin)) * 100;
    } else {
      return ((extremeMax - temp) / (extremeMax - optimalMax)) * 100;
    }
  };

  const calculateAtmosphereScore = (atmosphere) => {
    const atmosphereScores = {
      'earth-like': 100,
      'thin': 60,
      'thick': 40,
      'none': 0
    };
    return atmosphereScores[atmosphere] || 50;
  };

  const calculateGravityScore = (gravity) => {
    if (gravity >= 0.8 && gravity <= 1.2) return 100;
    if (gravity >= 0.5 && gravity <= 1.5) return 80;
    if (gravity >= 0.3 && gravity <= 2.0) return 50;
    if (gravity >= 0.1 && gravity <= 3.0) return 30;
    return 0;
  };

  const calculateWaterScore = (waterPercentage) => {
    if (waterPercentage >= 50 && waterPercentage <= 80) return 100;
    if (waterPercentage > 80) return 100 - ((waterPercentage - 80) * 2);
    if (waterPercentage >= 30) return 80;
    if (waterPercentage >= 10) return 50;
    if (waterPercentage > 0) return 30;
    return 0;
  };

  const calculateRadiationScore = (atmosphere, gravity, magneticField) => {
    const atmosphereProtection = calculateAtmosphereScore(atmosphere) * 0.4;
    const magneticProtection = (magneticField >= 1 ? 100 : magneticField * 100) * 0.4;
    const gravityProtection = calculateGravityScore(gravity) * 0.2;
    return Math.min(100, atmosphereProtection + magneticProtection + gravityProtection);
  };

  const getHabitabilityScore = () => {
    if (!analysis) return 0;
    const values = Object.values(analysis);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  const getHabitabilityClass = (score) => {
    if (score >= 90) return 'Super-habitable';
    if (score >= 80) return 'Earth-like';
    if (score >= 70) return 'Potentially Habitable';
    if (score >= 50) return 'Challenging but Possible';
    if (score >= 30) return 'Extreme Conditions';
    return 'Uninhabitable';
  };

  const getDetailedRecommendations = () => {
    if (!analysis) return [];
    const recommendations = [];
    
    if (analysis.temperature < 70) {
      recommendations.push({
        category: 'Temperature',
        issue: 'Suboptimal temperature conditions',
        solution: selectedPlanet.temperature > 50 
          ? 'Consider advanced cooling systems and heat-resistant infrastructure'
          : 'Implement heating systems and insulated habitats'
      });
    }

    if (analysis.atmosphere < 70) {
      recommendations.push({
        category: 'Atmosphere',
        issue: 'Inadequate atmospheric conditions',
        solution: selectedPlanet.atmosphere === 'none'
          ? 'Requires enclosed habitats with artificial atmosphere'
          : 'Consider atmospheric processing and terraforming options'
      });
    }

    if (analysis.radiation < 70) {
      recommendations.push({
        category: 'Radiation',
        issue: 'High radiation levels',
        solution: 'Implement radiation shielding and consider underground habitats'
      });
    }

    if (analysis.water < 70) {
      recommendations.push({
        category: 'Water',
        issue: 'Limited water availability',
        solution: 'Develop water extraction and recycling systems'
      });
    }

    if (analysis.gravity < 70) {
      recommendations.push({
        category: 'Gravity',
        issue: selectedPlanet.gravity < 1 ? 'Low gravity environment' : 'High gravity environment',
        solution: selectedPlanet.gravity < 1
          ? 'Consider artificial gravity systems and bone density maintenance programs'
          : 'Implement mechanical assistance systems and structural reinforcement'
      });
    }

    return recommendations;
  };

  const getColorForValue = (value) => {
    if (value >= 80) return '#a6ff00';
    if (value >= 60) return '#ffd000';
    return '#ff4040';
  };

  const filteredPlanets = Object.values(solarSystemPlanets).filter(planet =>
    planet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <VisualizationCard>
        <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          {selectedPlanet && (
            <Planet planetData={selectedPlanet} />
          )}
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            maxDistance={10}
            minDistance={3}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
      </VisualizationCard>

      <Container>
        <Title>Habitability Analyzer</Title>
        
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search planets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <PlanetGrid>
            <CreatePlanetCard onClick={onCreatePlanet}>
              <h3>Create Your Planet</h3>
              <p>Tap here to build and analyze your own custom planet</p>
            </CreatePlanetCard>
            {filteredPlanets.map(planet => (
              <PlanetCard
                key={planet.name}
                selected={selectedPlanet?.name === planet.name}
                onClick={() => setSelectedPlanet(planet)}
              >
                <h3>{planet.name}</h3>
                <p>{planet.description}</p>
              </PlanetCard>
            ))}
          </PlanetGrid>
        </SearchContainer>

        {selectedPlanet && analysis && (
          <>
            <AnalysisSection>
              <h3>Detailed Analysis</h3>
              {Object.entries(analysis).map(([key, value]) => (
                <Parameter key={key}>
                  <Label>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <Value color={getColorForValue(value)}>
                      {value.toFixed(1)}%
                    </Value>
                  </Label>
                  <ProgressBar value={value} color={getColorForValue(value)} />
                </Parameter>
              ))}
            </AnalysisSection>

            <ResultCard>
              <ResultTitle>
                Habitability Score: {getHabitabilityScore()}%
                <span style={{ fontSize: '0.8em', marginLeft: '10px' }}>
                  ({getHabitabilityClass(getHabitabilityScore())})
                </span>
              </ResultTitle>
              
              <ResultText>
                {selectedPlanet.name} shows {getHabitabilityClass(getHabitabilityScore()).toLowerCase()} conditions for potential habitation.
              </ResultText>

              <h4>Detailed Recommendations</h4>
              {getDetailedRecommendations().map((rec, index) => (
                <RecommendationCard key={index}>
                  <h5>{rec.category}</h5>
                  <p><strong>Issue:</strong> {rec.issue}</p>
                  <p><strong>Solution:</strong> {rec.solution}</p>
                </RecommendationCard>
              ))}
            </ResultCard>

            {selectedPlanet.name !== 'Earth' && (
              <ComparisonCard>
                <h4>Comparison with Earth</h4>
                <ComparisonItem>
                  <span>Size: {(selectedPlanet.size * 100).toFixed(1)}% of Earth</span>
                  <ComparisonBar value={(selectedPlanet.size * 100)} reference={100} />
                </ComparisonItem>
                <ComparisonItem>
                  <span>Gravity: {(selectedPlanet.gravity * 100).toFixed(1)}% of Earth</span>
                  <ComparisonBar value={(selectedPlanet.gravity * 100)} reference={100} />
                </ComparisonItem>
                <ComparisonItem>
                  <span>Temperature: {selectedPlanet.temperature}°C vs Earth's 15°C</span>
                  <ComparisonBar value={selectedPlanet.temperature} reference={15} type="temperature" />
                </ComparisonItem>
              </ComparisonCard>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default HabitabilityAnalyzer;

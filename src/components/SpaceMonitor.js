import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SpaceMonitorContainer = styled.div`
  background: linear-gradient(to bottom, #0a192f, #000000);
  min-height: 100vh;
  color: #ffffff;
  padding: 6rem 2rem 2rem 2rem;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #5ce1e6;
  text-shadow: 0 0 10px rgba(92, 225, 230, 0.5),
               0 0 20px rgba(92, 225, 230, 0.3),
               0 0 30px rgba(92, 225, 230, 0.2);
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #8892b0;
  font-size: 1.1rem;
  margin-bottom: 3rem;
  opacity: 0.8;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background: rgba(10, 25, 47, 0.9);
  background: linear-gradient(
    145deg,
    rgba(10, 25, 47, 0.9) 0%,
    rgba(10, 25, 47, 0.7) 100%
  );
  border-radius: 15px;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease-in-out;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 255, 218, 0.1);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px 0 rgba(0, 0, 0, 0.4);
    border-color: rgba(100, 255, 218, 0.3);
  }

  h3 {
    color: #5ce1e6;
    margin-bottom: 1rem;
  }

  p {
    color: #8892b0;
    line-height: 1.6;
    font-size: 1.1rem;
  }
`;

const DataLegend = styled.div`
  background: rgba(10, 25, 47, 0.9);
  background: linear-gradient(
    145deg,
    rgba(10, 25, 47, 0.9) 0%,
    rgba(10, 25, 47, 0.7) 100%
  );
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 255, 218, 0.1);

  h3 {
    color: #5ce1e6;
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    color: #8892b0;
    font-size: 1.1rem;
  }

  .hazard-dot {
    width: 12px;
    height: 12px;
    background: linear-gradient(90deg, #ff4757, #ff6b81);
    border-radius: 50%;
    margin-right: 0.8rem;
  }
`;

const DateRangeContainer = styled.div`
  background: rgba(10, 25, 47, 0.9);
  background: linear-gradient(
    145deg,
    rgba(10, 25, 47, 0.9) 0%,
    rgba(10, 25, 47, 0.7) 100%
  );
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 255, 218, 0.1);

  h3 {
    color: #5ce1e6;
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }

  .date-inputs {
    display: flex;
    gap: 1.5rem;
  }

  input {
    background: rgba(10, 25, 47, 0.7);
    border: 1px solid rgba(100, 255, 218, 0.3);
    border-radius: 8px;
    padding: 0.8rem 1.2rem;
    color: #ffffff;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    flex: 1;

    &:hover, &:focus {
      border-color: rgba(100, 255, 218, 0.6);
      box-shadow: 0 0 15px rgba(100, 255, 218, 0.1);
      outline: none;
    }
  }
`;

const AsteroidsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const AsteroidCard = styled.div`
  background: rgba(10, 25, 47, 0.7);
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid ${props => props.isHazardous ? 'rgba(255, 71, 87, 0.3)' : 'rgba(100, 255, 218, 0.1)'};
  position: relative;

  h3 {
    color: #64ffda;
    margin-bottom: 1rem;
  }

  .data-row {
    margin-bottom: 0.8rem;
    color: #8892b0;
  }

  .hazard-tag {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #ff4757;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.8rem;
  }

  .more-details {
    color: #64ffda;
    text-decoration: none;
    display: inline-block;
    margin-top: 1rem;
  }
`;

const SpaceMonitor = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=DEMO_KEY`
        );
        const data = await response.json();
        const allAsteroids = Object.values(data.near_earth_objects).flat();
        setAsteroids(allAsteroids);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching asteroid data:', error);
        setLoading(false);
      }
    };

    fetchAsteroids();
  }, [startDate, endDate]);

  return (
    <SpaceMonitorContainer>
      <Title>Real-Time Space Monitor</Title>
      <Subtitle>
        Track and monitor near-Earth objects as they pass through our cosmic neighborhood.
      </Subtitle>

      <FeaturesGrid>
        <FeatureCard>
          <h3>Near-Earth Objects</h3>
          <p>Monitor asteroids and other objects that pass within 30 million miles of Earth's orbit. Get real-time data on their size, speed, and trajectory.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>Hazard Assessment</h3>
          <p>Identify potentially hazardous asteroids (PHAs) based on NASA's classification system. PHAs are objects that come within 4.6 million miles of Earth's orbit.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>Detailed Analytics</h3>
          <p>Access comprehensive data including object diameter, velocity, miss distance, and close approach timing. All information is sourced directly from NASA's NEO database.</p>
        </FeatureCard>
      </FeaturesGrid>

      <DataLegend>
        <h3>Understanding the Data</h3>
        <div className="legend-item">
          <div className="hazard-dot"></div>
          <span>Potentially Hazardous</span>
        </div>
        <div className="legend-item">Diameter: Estimated size in kilometers</div>
        <div className="legend-item">Velocity: Speed relative to Earth</div>
        <div className="legend-item">Miss Distance: Closest approach in lunar distances</div>
      </DataLegend>

      <DateRangeContainer>
        <h3>Select Date Range</h3>
        <div className="date-inputs">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </DateRangeContainer>

      {loading ? (
        <p>Loading space data...</p>
      ) : (
        <AsteroidsGrid>
          {asteroids.map((asteroid) => (
            <AsteroidCard
              key={asteroid.id}
              isHazardous={asteroid.is_potentially_hazardous_asteroid}
            >
              <h3>{asteroid.name.replace('(', '').replace(')', '')}</h3>
              {asteroid.is_potentially_hazardous_asteroid && (
                <span className="hazard-tag">Hazardous</span>
              )}
              <div className="data-row">
                <strong>Diameter:</strong> {(asteroid.estimated_diameter.kilometers.estimated_diameter_max).toFixed(2)} km
              </div>
              <div className="data-row">
                <strong>Velocity:</strong> {Math.round(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour)} km/h
              </div>
              <div className="data-row">
                <strong>Miss Distance:</strong> {Math.round(asteroid.close_approach_data[0].miss_distance.lunar)} lunar distances
              </div>
              <div className="data-row">
                <strong>Close Approach:</strong> {asteroid.close_approach_data[0].close_approach_date}
              </div>
              <a 
                href={`https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${asteroid.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="more-details"
              >
                More Details →
              </a>
            </AsteroidCard>
          ))}
        </AsteroidsGrid>
      )}
    </SpaceMonitorContainer>
  );
};

export default SpaceMonitor;

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { searchWithGemini } from '../../services/geminiService';

// Import category images
import satelliteImg from '../../assets/satellite.jpg';
import astronautImg from '../../assets/astronaut.jpg';
import rocketImg from '../../assets/rocket.jpg';

const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f0c29, #302b63, #24243e);
  color: white;
  padding-top: 120px;
`;

const WelcomeSection = styled.div`
  margin: 2rem auto 3rem;
  max-width: 1000px;
  opacity: ${props => props.isSearching ? 0 : 1};
  transition: opacity 0.3s ease;
  height: ${props => props.isSearching ? '0' : 'auto'};
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const WelcomeContent = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const ImageSection = styled.div`
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 40px;
    background: linear-gradient(to right, transparent, rgba(15, 12, 41, 0.8));
    
    @media (max-width: 1024px) {
      display: none;
    }
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: ${props => props.category === 'rockets' ? 'auto' : '300px'};
  max-height: ${props => props.category === 'rockets' ? 'none' : '300px'};
  object-fit: ${props => props.category === 'rockets' ? 'contain' : 'cover'};
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
`;

const InfoSection = styled.div`
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const CategoryDescription = styled.div`
  color: #e0e0e0;
  
  h2 {
    font-size: 1.6rem;
    margin-bottom: 1.2rem;
    background: linear-gradient(45deg, #00aeff, #a6ff00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1.2rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0;
  }

  li {
    font-size: 1rem;
    margin-bottom: 0.8rem;
    padding-left: 1.2rem;
    position: relative;
    
    &:before {
      content: '•';
      position: absolute;
      left: 0;
      color: #a6ff00;
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 800px;
  margin: 3rem auto;
  flex-wrap: wrap;
  padding: 0 1rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  min-height: 200px; /* Minimum height to prevent layout shifts */
`;

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%; /* Full height to prevent layout shifts */
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled.h3`
  color: white;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const Description = styled.p`
  color: #ddd;
  font-size: 0.9rem;
  line-height: 1.6;
`;

const DateInfo = styled.div`
  color: #aaa;
  font-size: 0.8rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, .3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin: 2rem auto;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Message = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.error ? '#ff6b6b' : '#ddd'};
  font-size: 1.1rem;
`;

const CategoryTitle = styled.h1`
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  background: linear-gradient(45deg, #00aeff, #a6ff00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(166, 255, 0, 0.3);
  position: relative;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, #0f0c29, transparent);
    z-index: -1;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 1rem;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }
`;

function CategoryPage() {
  const { category } = useParams();
  const [nameQuery, setNameQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [debouncedNameQuery, setDebouncedNameQuery] = useState('');
  const [debouncedDateQuery, setDebouncedDateQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameQuery(nameQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [nameQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDateQuery(dateQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [dateQuery]);

  const searchGemini = useCallback(async () => {
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      setError('API key not found. Please check your environment variables.');
      return;
    }

    if (!debouncedNameQuery.trim() && !debouncedDateQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await searchWithGemini(
        category,
        debouncedNameQuery.trim(),
        debouncedDateQuery.trim()
      );
      setResults(searchResults);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching:', error);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [category, debouncedNameQuery, debouncedDateQuery]);

  useEffect(() => {
    searchGemini();
  }, [searchGemini]);

  const getCategoryInfo = () => {
    const info = {
      satellites: {
        title: 'Space Satellites Explorer',
        description: {
          main: 'Discover the fascinating world of artificial satellites orbiting our planet. From communication satellites enabling global connectivity to Earth observation satellites monitoring our environment.',
          features: [
            'Explore different types of satellites and their orbits',
            'Learn about communication, weather, and spy satellites',
            'Track real-time satellite positions and data',
            'Discover the latest developments in satellite technology'
          ],
          additional: 'Our comprehensive database includes detailed information about launch dates, mission objectives, and current operational status of various satellites.'
        },
        image: satelliteImg
      },
      astronauts: {
        title: 'Astronauts Database',
        description: {
          main: 'Meet the brave pioneers who ventured beyond Earth\'s atmosphere. Learn about legendary space explorers, their historic missions, and groundbreaking achievements.',
          features: [
            'Explore astronaut biographies and mission histories',
            'Discover spacewalk records and achievements',
            'Learn about astronaut training and selection',
            'Follow current ISS crew members and their activities'
          ],
          additional: 'From the first human in space to modern-day explorers, our database covers the entire history of human spaceflight.'
        },
        image: astronautImg
      },
      rockets: {
        title: 'Space Rockets Archive',
        description: {
          main: 'Explore the powerful rockets that make space exploration possible. From historic launches to modern reusable rockets, discover the engineering marvels of space travel.',
          features: [
            'Compare different rocket types and capabilities',
            'Learn about rocket engines and propulsion',
            'Track upcoming launches and missions',
            'Explore the evolution of rocket technology'
          ],
          additional: 'Our archive includes comprehensive data about launch vehicles, from the early days of rocketry to modern commercial spaceflight.'
        },
        image: rocketImg
      }
    };
    return info[category] || { title: category, description: { main: '', features: [], additional: '' }, image: '' };
  };

  const categoryInfo = getCategoryInfo();
  const isSearching = Boolean(debouncedNameQuery || debouncedDateQuery);

  return (
    <Container>
      <ContentWrapper>
        <CategoryTitle>{categoryInfo.title}</CategoryTitle>
        
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder={`Search ${category} by name...`}
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
          />
          <SearchInput
            type="text"
            placeholder="Search by date or year..."
            value={dateQuery}
            onChange={(e) => setDateQuery(e.target.value)}
          />
        </SearchContainer>

        {error && <Message error>{error}</Message>}

        {!isSearching && (
          <WelcomeSection isSearching={isSearching}>
            <WelcomeContent>
              <ImageSection>
                <CategoryImage 
                  src={categoryInfo.image} 
                  alt={categoryInfo.title}
                  category={category}
                />
              </ImageSection>
              <InfoSection>
                <CategoryDescription>
                  <h2>Welcome to {categoryInfo.title}</h2>
                  <p>{categoryInfo.description.main}</p>
                  <ul>
                    {categoryInfo.description.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p>{categoryInfo.description.additional}</p>
                </CategoryDescription>
              </InfoSection>
            </WelcomeContent>
          </WelcomeSection>
        )}

        {isSearching && (
          <ResultsGrid>
            {loading ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center',
                padding: '3rem'
              }}>
                <LoadingSpinner />
                <p>Searching for {category}...</p>
              </div>
            ) : hasSearched && results.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center',
                padding: '3rem'
              }}>
                <Message>
                  No results found. Try different search terms or date range.
                </Message>
              </div>
            ) : (
              results.map((result, index) => (
                <ResultCard key={index}>
                  <Title>{result.title}</Title>
                  <Description>{result.description}</Description>
                  <DateInfo>{result.date}</DateInfo>
                </ResultCard>
              ))
            )}
          </ResultsGrid>
        )}
      </ContentWrapper>
    </Container>
  );
}

export default CategoryPage;

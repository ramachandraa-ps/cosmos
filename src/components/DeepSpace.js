import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const DeepSpaceContainer = styled.div`
  background: linear-gradient(to bottom, #0a192f, #000000);
  min-height: 100vh;
  color: #ffffff;
  padding: 6rem 2rem 2rem 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  text-align: center;
  color: #5ce1e6;
  text-shadow: 0 0 10px rgba(92, 225, 230, 0.5),
               0 0 20px rgba(92, 225, 230, 0.3),
               0 0 30px rgba(92, 225, 230, 0.2);
  font-family: 'Space Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #8892b0;
  font-size: 1.2rem;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const InfoSection = styled.div`
  background: rgba(10, 25, 47, 0.9);
  background: linear-gradient(
    145deg,
    rgba(10, 25, 47, 0.9) 0%,
    rgba(10, 25, 47, 0.7) 100%
  );
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 3rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 255, 218, 0.1);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  h2 {
    color: #64ffda;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    position: relative;
    padding-bottom: 0.5rem;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100px;
      height: 2px;
      background: #64ffda;
      opacity: 0.5;
    }
  }

  p {
    color: #8892b0;
    line-height: 1.8;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ImageCard = styled.div`
  background: rgba(10, 25, 47, 0.9);
  background: linear-gradient(
    145deg,
    rgba(10, 25, 47, 0.9) 0%,
    rgba(10, 25, 47, 0.7) 100%
  );
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 255, 218, 0.1);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px 0 rgba(0, 0, 0, 0.4);
    border-color: rgba(100, 255, 218, 0.3);
  }

  .image-container {
    position: relative;
    padding-top: 100%;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.1);
    }
  }

  .image-info {
    padding: 1.5rem;

    h3 {
      color: #64ffda;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    p {
      color: #8892b0;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .coordinates {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      font-family: 'Space Mono', monospace;
      font-size: 0.9rem;
      color: #5ce1e6;
    }
  }
`;

const DateSelector = styled.div`
  background: rgba(10, 25, 47, 0.9);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 255, 218, 0.1);
  text-align: center;

  input {
    background: rgba(10, 25, 47, 0.7);
    border: 1px solid rgba(100, 255, 218, 0.3);
    border-radius: 8px;
    padding: 0.8rem 1.2rem;
    color: #ffffff;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    margin: 0 1rem;

    &:hover, &:focus {
      border-color: rgba(100, 255, 218, 0.6);
      box-shadow: 0 0 15px rgba(100, 255, 218, 0.1);
      outline: none;
    }
  }
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: #64ffda;
  margin: 2rem 0;
`;

const DeepSpace = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    const fetchEpicImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.nasa.gov/EPIC/api/natural/date/${selectedDate}?api_key=DEMO_KEY`
        );
        const data = await response.json();
        console.log('Fetched EPIC data:', data);
        if (data.length > 0) {
          setImages(data);
        } else {
          console.warn('No images available for the selected date.');
        }
      } catch (error) {
        console.error('Error fetching EPIC images:', error);
      }
      setLoading(false);
    };

    fetchEpicImages();
  }, [selectedDate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (image) => {
    const date = new Date(image.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `https://api.nasa.gov/EPIC/archive/natural/${year}/${month}/${day}/png/${image.image}.png?api_key=DEMO_KEY`;
  };

  return (
    <DeepSpaceContainer>
      <Title>Deep Space Explorer</Title>
      <Subtitle>
        Journey through Earth's most stunning perspectives captured by NASA's EPIC camera,
        positioned at the Earth-Sun Lagrange point.
      </Subtitle>

      <InfoSection>
        <h2>About EPIC (Earth Polychromatic Imaging Camera)</h2>
        <p>
          EPIC provides full disc imagery of the Earth and captures unique perspectives from
          approximately one million miles away. Using a 2048x2048 pixel CCD detector coupled
          to a 30-cm aperture Cassegrain telescope, EPIC captures extraordinary views of our
          planet and rare astronomical events.
        </p>
        <p>
          Positioned at the Earth-Sun Lagrange point, EPIC maintains a constant view of the
          sunlit face of Earth, providing vital data about ozone, vegetation, cloud height,
          and aerosols in the atmosphere.
        </p>
      </InfoSection>

      <DateSelector>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </DateSelector>

      {loading ? (
        <LoadingText>Loading Earth imagery...</LoadingText>
      ) : (
        <ImageGrid>
          {images.map((image) => (
            <ImageCard key={image.identifier}>
              <div className="image-container">
                <img src={getImageUrl(image)} alt={image.caption} loading="lazy" />
              </div>
              <div className="image-info">
                <h3>{formatDate(image.date)}</h3>
                <p>{image.caption}</p>
                <div className="coordinates">
                  <span>Lat: {image.centroid_coordinates.lat.toFixed(2)}°</span>
                  <span>Lon: {image.centroid_coordinates.lon.toFixed(2)}°</span>
                </div>
              </div>
            </ImageCard>
          ))}
        </ImageGrid>
      )}
    </DeepSpaceContainer>
  );
};

export default DeepSpace;

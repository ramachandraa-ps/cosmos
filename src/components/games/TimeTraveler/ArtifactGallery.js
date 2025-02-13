import React from 'react';
import styled from 'styled-components';

const GalleryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const ArtifactCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    background: rgba(0, 0, 0, 0.4);
    border-color: #00ffff;
  }
`;

const ArtifactImage = styled.div`
  width: 100%;
  height: 150px;
  background: ${props => `url(${props.src})`};
  background-size: cover;
  background-position: center;
  border-radius: 5px;
  margin-bottom: 1rem;
`;

const ArtifactName = styled.h3`
  color: #00ffff;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const ArtifactDescription = styled.p`
  color: #ddd;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
`;

const ArtifactSignificance = styled.div`
  color: #888;
  font-size: 0.8rem;
  font-style: italic;
`;

const ArtifactGallery = ({ artifacts }) => {
  return (
    <GalleryContainer>
      {artifacts.map((artifact, index) => (
        <ArtifactCard key={index}>
          <ArtifactImage src={artifact.image} />
          <ArtifactName>{artifact.name}</ArtifactName>
          <ArtifactDescription>{artifact.description}</ArtifactDescription>
          <ArtifactSignificance>{artifact.significance}</ArtifactSignificance>
        </ArtifactCard>
      ))}
    </GalleryContainer>
  );
};

export default ArtifactGallery;

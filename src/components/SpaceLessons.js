import React from 'react';
import styled from 'styled-components';

const SpaceLessonsContainer = styled.div`
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

const CourseContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  max-width: 1200px;
  margin: 2rem auto;
`;

const CourseCard = styled.div`
  width: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CourseImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const CourseTitle = styled.h3`
  color: white;
  margin-bottom: 0.5rem;
`;

const CourseDescription = styled.p`
  color: #ddd;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PriceTag = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: ${props => props.free ? '#4CAF50' : '#2196F3'};
  border-radius: 20px;
  font-weight: bold;
`;

const SpaceLessons = () => {
  const courses = [
    {
      title: "Introduction to Astronomy",
      description: "Learn the basics of astronomy and our solar system",
      image: "/courses/intro-astronomy.jpg",
      free: true
    },
    {
      title: "Stars and Constellations",
      description: "Explore the night sky and learn to identify celestial objects",
      image: "/courses/stars.jpg",
      free: true
    },
    {
      title: "Advanced Astrophysics",
      description: "Deep dive into the physics of space and celestial mechanics",
      image: "/courses/astrophysics.jpg",
      price: "$49.99"
    },
    {
      title: "Space Exploration History",
      description: "Journey through the history of human space exploration",
      image: "/courses/space-history.jpg",
      price: "$39.99"
    },
    {
      title: "Rocket Science Fundamentals",
      description: "Understanding rocket propulsion and spacecraft design",
      image: "/courses/rocket-science.jpg",
      price: "$59.99"
    },
    {
      title: "Exoplanets and Life",
      description: "Study of planets beyond our solar system and potential for life",
      image: "/courses/exoplanets.jpg",
      price: "$44.99"
    }
  ];

  return (
    <SpaceLessonsContainer>
      <Title>Space Lessons</Title>
      <CourseContainer>
        {courses.map((course, index) => (
          <CourseCard key={index}>
            <CourseImage src={course.image} alt={course.title} />
            <CourseTitle>{course.title}</CourseTitle>
            <CourseDescription>{course.description}</CourseDescription>
            <PriceTag free={course.free}>
              {course.free ? 'FREE' : course.price}
            </PriceTag>
          </CourseCard>
        ))}
      </CourseContainer>
    </SpaceLessonsContainer>
  );
};

export default SpaceLessons;

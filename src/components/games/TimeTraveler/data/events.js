export const timelineEvents = [
  {
    id: 'ancient_astronomy',
    title: 'Ancient Astronomy Begins',
    date: '3000 BCE',
    description: 'Early civilizations begin studying the stars and creating the first star maps.',
    location: 'Mesopotamia',
    backgroundImage: '/backgrounds/mesopotamia.jpg',
    characters: ['Ancient Astronomers'],
    artifacts: ['clay_tablet_star_map'],
    content: {
      intro: 'Welcome to Ancient Mesopotamia, where humanity first began to map the stars...',
      dialogues: [
        {
          speaker: 'Astronomer',
          text: 'Every night, we observe the movement of celestial bodies and record them on these clay tablets.'
        },
        {
          speaker: 'Astronomer',
          text: 'Would you like to learn how we track the movements of the stars?'
        }
      ],
      interactions: [
        {
          type: 'observation',
          discovery: 'The ancient Mesopotamians divided the sky into constellations, many of which we still recognize today.'
        },
        {
          type: 'dialogue',
          discovery: 'The astronomers explain how they use water clocks to measure the passage of time and track star movements.'
        },
        {
          type: 'collect',
          discovery: 'You carefully document the ancient star map, noting the familiar patterns that would later become our modern constellations.'
        }
      ]
    }
  },
  {
    id: 'galileo_telescope',
    title: 'Galileo\'s Telescope',
    date: '1609 CE',
    description: 'Galileo improves the telescope and makes groundbreaking astronomical discoveries.',
    location: 'Italy',
    backgroundImage: '/backgrounds/renaissance_italy.jpg',
    characters: ['Galileo Galilei'],
    artifacts: ['galileo_telescope', 'jupiter_moons_sketch'],
    content: {
      intro: 'Step into Renaissance Italy, where Galileo is about to change our view of the cosmos forever...',
      dialogues: [
        {
          speaker: 'Galileo',
          text: 'With this instrument, I have observed mountains on the Moon, and four stars dancing around Jupiter!'
        },
        {
          speaker: 'Galileo',
          text: 'Would you like to see for yourself? The telescope is ready for viewing.'
        }
      ],
      interactions: [
        {
          type: 'observation',
          discovery: 'Through the telescope, you can clearly see Jupiter\'s moons, proving not everything orbits Earth!'
        },
        {
          type: 'dialogue',
          discovery: 'Galileo explains how he improved the telescope design to achieve better magnification.'
        },
        {
          type: 'collect',
          discovery: 'You carefully sketch Jupiter and its moons, just as Galileo did in his groundbreaking observations.'
        }
      ]
    }
  },
  {
    id: 'newton_gravity',
    title: 'Newton\'s Universal Gravity',
    date: '1687 CE',
    description: 'Isaac Newton publishes his theory of universal gravitation.',
    location: 'England',
    backgroundImage: '/backgrounds/newton_study.jpg',
    characters: ['Isaac Newton'],
    artifacts: ['principia_mathematica', 'apple_legend'],
    content: {
      intro: 'Visit Cambridge University, where Newton is developing his revolutionary theory of gravity...',
      dialogues: [
        {
          speaker: 'Newton',
          text: 'The same force that draws an apple to the ground keeps the Moon in its orbit around Earth.'
        },
        {
          speaker: 'Newton',
          text: 'Would you like to see the mathematical principles that govern the motions of all celestial bodies?'
        }
      ],
      interactions: [
        {
          type: 'observation',
          discovery: 'You observe Newton\'s precise calculations that explain both earthly and celestial motions.'
        },
        {
          type: 'dialogue',
          discovery: 'Newton reveals how he developed his inverse square law of gravitation.'
        },
        {
          type: 'collect',
          discovery: 'You obtain a first edition copy of Principia Mathematica, Newton\'s masterwork on gravity and motion.'
        }
      ]
    }
  }
];

export const artifacts = {
  clay_tablet_star_map: {
    id: 'clay_tablet_star_map',
    name: 'Ancient Star Map',
    description: 'A clay tablet containing one of the earliest known star maps.',
    image: '/artifacts/star_map.jpg',
    significance: 'Shows early human understanding of celestial patterns.'
  },
  galileo_telescope: {
    id: 'galileo_telescope',
    name: 'Galileo\'s Telescope',
    description: 'One of the first telescopes used for astronomical observation.',
    image: '/artifacts/telescope.jpg',
    significance: 'Revolutionized our ability to study celestial objects.'
  },
  jupiter_moons_sketch: {
    id: 'jupiter_moons_sketch',
    name: 'Jupiter\'s Moons Sketch',
    description: 'Galileo\'s original drawings of Jupiter\'s moons.',
    image: '/artifacts/jupiter_sketch.jpg',
    significance: 'First evidence of objects orbiting another planet.'
  },
  principia_mathematica: {
    id: 'principia_mathematica',
    name: 'Principia Mathematica',
    description: 'Newton\'s groundbreaking book on physics and gravity.',
    image: '/artifacts/principia.jpg',
    significance: 'Established the foundations of classical mechanics.'
  }
};

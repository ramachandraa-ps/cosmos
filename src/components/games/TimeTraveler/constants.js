export const MASTERY_LEVELS = {
  NOVICE: {
    id: 'novice',
    name: 'Novice Explorer',
    minScore: 0,
    description: 'Beginning your journey through the cosmos',
    badge: '🌟',
    nextLevel: 'Skilled Astronomer'
  },
  SKILLED: {
    id: 'skilled',
    name: 'Skilled Astronomer',
    minScore: 50,
    description: 'Deepening your understanding of the universe',
    badge: '🔭',
    nextLevel: 'Master Cosmologist'
  },
  MASTER: {
    id: 'master',
    name: 'Master Cosmologist',
    minScore: 80,
    description: 'Mastering the secrets of space and time',
    badge: '🌌',
    nextLevel: null
  }
};

export const NEXT_EVENT_MAP = {
  'ancient_astronomy': 'galileo_telescope',
  'galileo_telescope': 'newton_universal_gravity',
  'newton_universal_gravity': 'hubble_expansion'
};

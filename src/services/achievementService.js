import { MASTERY_LEVELS } from '../components/games/TimeTraveler/constants';

const calculateMasteryScore = (eventData) => {
  let score = 0;
  const maxScore = 100;

  // Check if user has made observations
  if (eventData.observations > 0) {
    score += 40; // Increased base points for making observations
    score += Math.min(20, eventData.observations * 10); // Increased points for multiple observations
  }

  // Check if user has engaged in conversations
  if (eventData.conversations > 0) {
    score += 40; // Increased base points for having conversations
    score += Math.min(20, eventData.conversations * 10); // Increased points for multiple conversations
  }

  // Simplified bonus points for questions
  if (eventData.questions && eventData.questions.length > 0) {
    score += Math.min(20, eventData.questions.length * 10);
  }

  return Math.min(score, maxScore);
};

const determineMasteryLevel = (score) => {
  if (score >= MASTERY_LEVELS.MASTER.minScore) {
    return MASTERY_LEVELS.MASTER;
  } else if (score >= MASTERY_LEVELS.SKILLED.minScore) {
    return MASTERY_LEVELS.SKILLED;
  }
  return MASTERY_LEVELS.NOVICE;
};

export const evaluateAchievement = (eventData) => {
  const score = calculateMasteryScore(eventData);
  const level = determineMasteryLevel(score);
  const nextLevel = level.nextLevel;

  return {
    score,
    level: level.name,
    description: level.description,
    badge: level.badge,
    nextLevel,
    details: [
      `Observations: ${eventData.observations}`,
      `Conversations: ${eventData.conversations}`,
      `Questions Asked: ${eventData.questions?.length || 0}`,
      `Mastery Score: ${score}%`,
      nextLevel ? `Next Level: ${nextLevel}` : 'Maximum Level Achieved!'
    ]
  };
};

import { MASTERY_LEVELS } from '../components/games/TimeTraveler/constants';

const calculateMasteryScore = (eventData) => {
  let score = 0;
  const maxScore = 100;

  // Check if user has made observations
  if (eventData.observations > 0) {
    score += 30; // Base points for making observations
    score += Math.min(20, eventData.observations * 5); // Additional points for multiple observations
  }

  // Check if user has engaged in conversations
  if (eventData.conversations > 0) {
    score += 30; // Base points for having conversations
    score += Math.min(20, eventData.conversations * 5); // Additional points for multiple conversations
  }

  // Bonus points for asking meaningful questions (determined by question length and keywords)
  if (eventData.questions) {
    const meaningfulQuestions = eventData.questions.filter(q => {
      const hasKeywords = /discovery|observation|method|theory|experiment|research|astronomy|universe|space|time/i.test(q);
      const isDetailedQuestion = q.length > 30;
      return hasKeywords && isDetailedQuestion;
    });
    score += Math.min(20, meaningfulQuestions.length * 5);
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

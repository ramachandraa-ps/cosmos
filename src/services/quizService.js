import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const generateQuizPrompt = (domain, level) => {
  return `Generate a space quiz about ${domain} with difficulty level ${level}. 
  Create exactly 10 multiple choice questions. Each question should have 4 options.
  
  Rules:
  1. Questions should be ${level.toLowerCase()} level
  2. Mix of factual and conceptual questions
  3. Include some visual descriptions for image-based questions
  4. Some questions can be true/false formatted as multiple choice
  
  Format each question as:
  {
    "question": "question text",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": 0,
    "hint": "helpful hint without giving away answer",
    "explanation": "brief explanation of correct answer"
  }
  
  Return exactly 10 questions in a JSON array.
  
  Additional instructions based on level:
  ${level === 'Easy' ? 'Focus on basic terminology and commonly known facts. Use simple language.' : ''}
  ${level === 'Medium' ? 'Include some technical terms and intermediate concepts. Mix of basic and advanced topics.' : ''}
  ${level === 'Hard' ? 'Focus on complex concepts, specific details, and advanced knowledge. Include mathematical or theoretical aspects where relevant.' : ''}
  
  Make questions engaging and educational.`;
};

export const generateQuestions = async (domain, level) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(generateQuizPrompt(domain, level));
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON array from the response
    const jsonStr = text.substring(
      text.indexOf('['),
      text.lastIndexOf(']') + 1
    );
    
    const questions = JSON.parse(jsonStr);
    
    // Validate and format questions
    return questions.slice(0, 10).map((q, index) => ({
      ...q,
      id: index,
      options: q.options.slice(0, 4), // Ensure exactly 4 options
      correct: typeof q.correct === 'number' ? q.correct : 0
    }));
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};

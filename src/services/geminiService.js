const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const generatePrompt = (category, nameQuery, dateQuery, userQuestion = '') => {
  const prompts = {
    historical_astronomy_story: `You are a knowledgeable astronomy historian. Tell me an engaging story about "${nameQuery}" from ${dateQuery}. 
    Focus on the astronomical discoveries, observations, and the historical context of that time period. 
    Make it educational but engaging, written in a narrative style that captures the wonder of astronomical discovery.
    Include specific details about:
    - The astronomical phenomena or discovery
    - The historical figures involved
    - The tools and methods used
    - The impact on our understanding of the universe
    Keep the response between 200-300 words.`,

    historical_figure_conversation: `You are ${nameQuery}, a historical figure from ${dateQuery}. 
    ${userQuestion ? 
      `A time traveler has asked you: "${userQuestion}"
      Respond to their specific question while staying in character.` :
      `Engage in a conversation about your astronomical discoveries and observations.
      Speak in first person, as if you are directly talking to a time traveler who has come to learn from you.
      Share your thoughts about:
      - Your most significant discoveries
      - The challenges you faced
      - Your methods and instruments
      - Your vision for the future of astronomy`
    }
    Keep the response between 150-250 words and maintain a conversational tone.`,

    default: `You are a space research expert. I need detailed information about ${category} related to "${nameQuery}" from around ${dateQuery}.
    Please provide information in a clear, engaging narrative format.`
  };

  return prompts[category] || prompts.default;
};

export const searchWithGemini = async (category, nameQuery, dateQuery, userQuestion = '') => {
  try {
    const prompt = generatePrompt(category, nameQuery, dateQuery, userQuestion);
    console.log('Sending prompt to Gemini:', prompt);
    
    const apiKey = API_KEY;
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw Gemini response:', data);

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from API');
    }

    const text = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', text);

    return {
      text: text,
      success: true
    };

  } catch (error) {
    console.error('Error in searchWithGemini:', error);
    return {
      text: 'I apologize, but I encountered an error while generating the response. Please try again.',
      success: false
    };
  }
};

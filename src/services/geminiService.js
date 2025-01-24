const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const generatePrompt = (category, nameQuery, dateQuery) => {
  let prompt = `You are a space research expert. I need detailed information about ${category}`;
  
  if (nameQuery) {
    prompt += ` related to or similar to "${nameQuery}". Include results that might have similar spelling or are closely related`;
  }
  
  if (dateQuery) {
    prompt += ` from around the time period "${dateQuery}"`;
  }

  prompt += `. Please provide information in the following JSON format:
  [
    {
      "title": "Title of the information",
      "description": "Detailed description with facts",
      "date": "Relevant date"
    }
  ]
  Important instructions:
  1. Return ONLY valid JSON array with 3-5 relevant results
  2. Include closely related items even if the spelling doesn't match exactly
  3. For space missions, include launch date, mission details, and achievements
  4. Sort results by relevance
  5. Ensure all dates are in YYYY-MM-DD format when possible`;

  return prompt;
};

export const searchWithGemini = async (category, nameQuery, dateQuery) => {
  let cachedResults = null;

  try {
    const prompt = generatePrompt(category, nameQuery, dateQuery);
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
            temperature: 0.7,
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

    try {
      const text = data.candidates[0].content.parts[0].text;
      console.log('Extracted text:', text);

      const jsonStr = text.replace(/```json|```|\n/g, '').trim();
      console.log('Cleaned JSON string:', jsonStr);

      const parsedData = JSON.parse(jsonStr);
      
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        return [{
          title: 'Expanding Search...',
          description: 'Trying to find related information. Please wait...',
          date: new Date().toISOString().split('T')[0]
        }];
      }

      const formattedResults = parsedData.map(item => ({
        title: item.title || 'Untitled',
        description: item.description || 'No description available',
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : 'Date not available'
      }));

      cachedResults = formattedResults;
      return formattedResults;
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      if (cachedResults) {
        return cachedResults;
      }
      return [{
        title: 'Processing Results',
        description: 'Still processing your search. Please try again in a moment.',
        date: new Date().toISOString().split('T')[0]
      }];
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (cachedResults) {
      return cachedResults;
    }
    return [{
      title: 'Search Error',
      description: `Please try again. Error: ${error.message}`,
      date: new Date().toISOString().split('T')[0]
    }];
  }
};

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const generatePrompt = (category, nameQuery, dateQuery) => {
  // Define category context but keep it flexible
  const categoryContext = {
    satellites: 'Focus on artificial satellites, space stations, and orbital spacecraft.',
    astronauts: 'Focus on astronauts, cosmonauts, and space travelers.',
    rockets: 'Focus on rockets, launch vehicles, and space propulsion systems.',
    historical_astronomy_story: 'Tell me an engaging story about the astronomical discovery or event.',
    historical_figure_conversation: 'Engage in a conversation about your astronomical discoveries and observations.'
  };

  let prompt = `You are a space research expert. I need detailed information about ${category}`;
  
  if (nameQuery) {
    prompt += ` related to or similar to "${nameQuery}". Include results that might have similar spelling or are closely related`;
  }
  
  if (dateQuery) {
    prompt += ` from around the time period "${dateQuery}"`;
  }

  // Add category-specific focus without being too restrictive
  prompt += `. ${categoryContext[category] || ''}`;

  if (category === 'historical_astronomy_story') {
    prompt = `You are a knowledgeable astronomy historian. Tell me an engaging story about "${nameQuery}" from ${dateQuery}. 
    Focus on the astronomical discoveries, observations, and the historical context of that time period. 
    Make it educational but engaging, written in a narrative style that captures the wonder of astronomical discovery.
    Include specific details about:
    - The astronomical phenomena or discovery
    - The historical figures involved
    - The tools and methods used
    - The impact on our understanding of the universe
    Keep the response between 200-300 words.`;
  } else if (category === 'historical_figure_conversation') {
    prompt = `You are ${nameQuery}, a historical figure from ${dateQuery}. 
    Engage in a conversation about your astronomical discoveries and observations.
    Speak in first person, as if you are directly talking to a time traveler who has come to learn from you.
    Share your thoughts about:
    - Your most significant discoveries
    - The challenges you faced
    - Your methods and instruments
    - Your vision for the future of astronomy
    Keep the response between 150-250 words and maintain a conversational tone.`;
  } else {
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
    5. Ensure all dates are in YYYY-MM-DD format when possible
    6. Prioritize results related to ${category}`;
  }

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

      if (category === 'historical_astronomy_story' || category === 'historical_figure_conversation') {
        return {
          text: text,
          success: true
        };
      }

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

      // Filter results to prioritize category-specific content
      const formattedResults = parsedData
        .map(item => ({
          title: item.title || 'Untitled',
          description: item.description || 'No description available',
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : 'Date not available'
        }))
        .filter(item => {
          const content = (item.title + ' ' + item.description).toLowerCase();
          const categoryTerms = {
            satellites: ['satellite', 'orbit', 'space station', 'spacecraft'],
            astronauts: ['astronaut', 'cosmonaut', 'spacewalk', 'space travel'],
            rockets: ['rocket', 'launch', 'propulsion', 'spacecraft']
          };
          
          // Check if content contains category-specific terms
          return categoryTerms[category]?.some(term => content.includes(term)) ?? true;
        });

      cachedResults = formattedResults;
      return formattedResults.length > 0 ? formattedResults : parsedData;

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

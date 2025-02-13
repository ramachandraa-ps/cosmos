const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const generatePrompt = (category, nameQuery, dateQuery) => {
  const basePrompt = `You are a space expert. I need detailed information about ${nameQuery} in the ${category} category ${dateQuery ? `from around ${dateQuery}` : ''}.
  Generate 3-4 distinct aspects or time periods about this ${category === 'astronauts' ? 'person' : 'subject'}.
  For each aspect, provide:
  1. A specific title (focusing on a particular achievement, mission, or characteristic)
  2. A concise description (2-3 sentences, focusing on that specific aspect)
  3. A relevant date or time period

  Format your response as a JSON array of objects with the following structure:
  [
    {
      "title": "Achievement or Period Title",
      "description": "Specific details about this aspect",
      "date": "Relevant date or period"
    }
  ]

  Make each card focused on a different aspect:`;

  const prompts = {
    satellites: `${basePrompt}
    - Launch and deployment
    - Major discoveries or achievements
    - Technical specifications and purpose
    - Current status or legacy`,
    
    astronauts: `${basePrompt}
    - Early life and training
    - Notable space missions
    - Scientific contributions
    - Awards and legacy`,
    
    rockets: `${basePrompt}
    - Development and first launch
    - Notable missions
    - Technical innovations
    - Impact on space exploration`,
    
    default: basePrompt
  };

  return prompts[category] || prompts.default;
};

const preprocessText = (text) => {
  // Remove any markdown code blocks
  text = text.replace(/```json\s*|\s*```/g, '');
  
  try {
    // Try to parse as JSON
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        title: item.title
          ? item.title.trim().substring(0, 100) // Limit title length
          : 'Information',
        description: item.description
          ? item.description
              .trim()
              .replace(/^["']|["']$/g, '') // Remove quotes
              .replace(/\\n/g, '\n') // Handle newlines
              .substring(0, 300) // Limit description length
          : 'No description available',
        date: item.date
          ? item.date.trim()
          : 'Date not specified'
      }));
    }
  } catch (e) {
    console.error('Error parsing JSON response:', e);
    // If parsing fails, split the text into paragraphs
    const paragraphs = text
      .split(/\n\n+/)
      .filter(p => p.trim().length > 0)
      .slice(0, 3);
    
    return paragraphs.map((p, i) => ({
      title: `${i + 1}. Information`,
      description: p.trim().substring(0, 300),
      date: 'Date not specified'
    }));
  }
};

export const searchWithGemini = async (category, nameQuery, dateQuery) => {
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
            topK: 32,
            topP: 0.8,
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

    // Process the response into multiple cards
    const processedResults = preprocessText(text);
    
    // Ensure we always return an array
    return Array.isArray(processedResults) ? processedResults : [processedResults];

  } catch (error) {
    console.error('Error in searchWithGemini:', error);
    return [{
      title: 'Error',
      description: 'Unable to retrieve information at this time. Please try again later.',
      date: 'Not specified'
    }];
  }
};

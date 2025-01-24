import { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const generatePrompt = (currentDate) => {
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();

  return `Find significant space history events that occurred on ${month}/${day} (any year). 
  Return ONLY events in this JSON format:
  [
    {
      "title": "Event title",
      "description": "Brief description of what happened",
      "date": "YYYY-MM-DD",
      "type": "launch/discovery/mission/achievement"
    }
  ]
  Important:
  1. Only include major space events (launches, discoveries, missions, achievements)
  2. Return 2-3 most significant events
  3. Ensure dates are accurate
  4. Sort by historical significance`;
};

export const fetchHistoricEvents = async () => {
  try {
    const currentDate = new Date();
    const prompt = generatePrompt(currentDate);
    
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + API_KEY,
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
            temperature: 0.3,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch historic events');
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return [];
    }

    const text = data.candidates[0].content.parts[0].text;
    const jsonStr = text.replace(/```json|```|\n/g, '').trim();
    const events = JSON.parse(jsonStr);

    return Array.isArray(events) ? events : [];

  } catch (error) {
    console.error('Error fetching historic events:', error);
    return [];
  }
};

export const useHistoricEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const historicEvents = await fetchHistoricEvents();
      setEvents(historicEvents);
      setLoading(false);
    };

    loadEvents();
  }, []);

  return { events, loading };
};

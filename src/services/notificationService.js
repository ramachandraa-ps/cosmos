import { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const generatePrompt = (currentDate) => {
  const month = currentDate.getMonth() + 1; // JavaScript months are 0-based
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
  3. Ensure dates are accurate and match exactly ${month}/${day} (any year)
  4. Sort by historical significance`;
};

const isSameMonthAndDay = (date1, date2) => {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
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
    let events = JSON.parse(jsonStr);

    // Filter events to ensure they match today's month and day
    const today = new Date();
    events = events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameMonthAndDay(eventDate, today);
    });

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

    // Refresh events at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow - now;

    const midnightTimer = setTimeout(() => {
      loadEvents();
    }, timeUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  return { events, loading };
};

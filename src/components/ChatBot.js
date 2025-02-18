import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isSpaceRelated = async (text) => {
    try {
      // First, check if the input is space-related using Gemini
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: `Is the following text related to space, astronomy, cosmos, planets, stars, galaxies, or any space-related topics? Reply with only 'yes' or 'no': "${text}"` }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      const answer = response.data.candidates[0].content.parts[0].text.toLowerCase().trim();
      return answer === 'yes';
    } catch (error) {
      console.error('Error checking space relation:', error);
      return false;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Check if the input is space-related
      const spaceRelated = await isSpaceRelated(input);
      
      if (!spaceRelated) {
        setMessages(prev => [...prev, { 
          text: "I apologize, but I can only assist with space-related topics. Please ask me something about space, astronomy, planets, stars, or any cosmic phenomena!",
          sender: 'bot'
        }]);
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: input }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const botResponse = response.data.candidates[0].content.parts[0].text;
      const botMessage = { text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot'
      }]);
    }
    
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Cosmos AI Assistant</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="loading">AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything about space..."
        />
        <button onClick={handleSend} disabled={isLoading}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
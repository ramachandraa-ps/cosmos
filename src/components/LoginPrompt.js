import React, { useState } from 'react';
import './LoginPrompt.css';
import { LoginForm, SignupForm } from './AuthForms';

const LoginPrompt = ({ onClose, isProtectedRoute }) => {
  const [showSignup, setShowSignup] = useState(false);

  const handleContainerClick = (e) => {
    if (!isProtectedRoute && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`login-prompt-container ${!isProtectedRoute ? 'non-protected' : ''}`} onClick={handleContainerClick}>
      <div className="login-prompt-content">
        {!isProtectedRoute && (
          <button className="close-button" onClick={onClose}>&times;</button>
        )}
        <div className="prompt-left">
          <div className="stars-overlay"></div>
          <h1>Welcome to Cosmos</h1>
          {isProtectedRoute ? (
            <p>Please login to access this feature</p>
          ) : (
            <p>Unlock the full potential of your cosmic journey</p>
          )}
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🌟</span>
              <span>Interactive Space Exploration</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <span>Join Live Space Webinars</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌌</span>
              <span>Participate in Space Quizzes</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span>Track Your Space Learning</span>
            </div>
          </div>
        </div>
        <div className="prompt-right">
          <div className="auth-container">
            {showSignup ? (
              <SignupForm 
                onClose={onClose}
                onSwitchToLogin={() => setShowSignup(false)}
              />
            ) : (
              <LoginForm 
                onClose={onClose}
                onSwitchToSignup={() => setShowSignup(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;

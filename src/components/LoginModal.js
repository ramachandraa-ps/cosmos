import React, { useState } from 'react';
import { LoginForm, SignupForm } from './AuthForms';
import './LoginModal.css';

const LoginModal = ({ onClose }) => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        {showSignup ? (
          <>
            <SignupForm onClose={onClose} />
            <p className="switch-auth">
              Already have an account?{' '}
              <button onClick={() => setShowSignup(false)}>Login</button>
            </p>
          </>
        ) : (
          <>
            <LoginForm onClose={onClose} />
            <p className="switch-auth">
              Don't have an account?{' '}
              <button onClick={() => setShowSignup(true)}>Sign up</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;

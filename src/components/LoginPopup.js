import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPopup.css';

const LoginPopup = ({ onClose, redirectPath }) => {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      if (redirectPath) {
        navigate(redirectPath);
      }
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      if (redirectPath) {
        navigate(redirectPath);
      }
    } catch (error) {
      setError(
        error.code === 'auth/user-not-found' ? 'No account found with this email' :
        error.code === 'auth/wrong-password' ? 'Incorrect password' :
        error.code === 'auth/email-already-in-use' ? 'Email already in use' :
        'Failed to authenticate. Please try again.'
      );
      console.error("Error with email auth:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <div className="login-popup-content">
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isSignUp ? 'Join our space community' : 'Please login to continue'}</p>
          
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleEmailAuth} className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="auth-button primary"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            className="auth-button google"
            disabled={loading}
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google"
              className="google-icon"
            />
            Continue with Google
          </button>

          <div className="auth-switch">
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="switch-button"
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
            </button>
          </div>

          <button 
            onClick={onClose} 
            className="close-button"
            disabled={loading}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;

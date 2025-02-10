import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const SignupForm = ({ onClose, onSwitchToLogin }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await signup(formData);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      {error && <div className="auth-error">{error}</div>}
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <button type="submit" className="submit-button">Create Account</button>
      {onSwitchToLogin && (
        <p className="switch-auth">
          Already have an account? <button type="button" onClick={onSwitchToLogin}>Login</button>
        </p>
      )}
    </form>
  );
};

export const LoginForm = ({ onClose, onSwitchToSignup }) => {
  const { login, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(formData.email, formData.password);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Welcome Back</h2>
      {error && <div className="auth-error">{error}</div>}
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <button type="submit" className="submit-button">Login</button>
      
      <div className="auth-divider">
        <span>OR</span>
      </div>

      <button 
        type="button" 
        onClick={handleGoogleSignIn} 
        className="submit-button"
      >
        <img 
          src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" 
          alt="Google" 
          style={{ 
            width: '20px', 
            height: '20px', 
            marginRight: '10px',
            verticalAlign: 'middle'
          }} 
        />
        Sign in with Google
      </button>

      {onSwitchToSignup && (
        <p className="switch-auth">
          Don't have an account? <button type="button" onClick={onSwitchToSignup}>Sign up</button>
        </p>
      )}
    </form>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserProfile from './UserProfile';
import LoginPrompt from './LoginPrompt';
import './ProfileAvatar.css';

const ProfileAvatar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const location = useLocation();
  
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  // Hide login prompt when route changes
  useEffect(() => {
    setShowLoginPrompt(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when login prompt is shown
  useEffect(() => {
    if (showLoginPrompt) {
      setShowDropdown(false);
    }
  }, [showLoginPrompt]);

  return (
    <div className="profile-avatar">
      <div 
        ref={avatarRef}
        className="avatar-circle"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {user ? (
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`}
            alt={user.name}
          />
        ) : (
          <svg 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="default-avatar"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        )}
      </div>

      {showDropdown && (
        <div ref={dropdownRef} className="profile-dropdown">
          {user ? (
            <>
              <button onClick={() => {
                setShowProfileModal(true);
                setShowDropdown(false);
              }}>
                <span>View Profile</span>
              </button>
              <button onClick={() => {
                logout();
                setShowDropdown(false);
              }}>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => {
                setShowLoginPrompt(true);
              }}>
                <span>Login</span>
              </button>
              <button onClick={() => {
                setShowLoginPrompt(true);
              }}>
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>
      )}

      {showLoginPrompt && !user && (
        <LoginPrompt 
          onClose={() => setShowLoginPrompt(false)} 
          isProtectedRoute={false}
        />
      )}

      {showProfileModal && (
        <UserProfile onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};

export default ProfileAvatar;

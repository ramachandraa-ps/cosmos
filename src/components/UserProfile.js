import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

const UserProfile = ({ onClose }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    bio: '',
    notes: [],
    interests: []
  });
  const [newNote, setNewNote] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load profile data from localStorage
    const savedProfile = localStorage.getItem(`profile_${user.id}`);
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, [user.id]);

  const saveProfile = (updatedProfile) => {
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
  };

  const handleBioChange = (e) => {
    const updatedProfile = { ...profile, bio: e.target.value };
    saveProfile(updatedProfile);
  };

  const addNote = () => {
    if (newNote.trim()) {
      const updatedProfile = {
        ...profile,
        notes: [...profile.notes, {
          id: Date.now(),
          text: newNote,
          date: new Date().toISOString()
        }]
      };
      saveProfile(updatedProfile);
      setNewNote('');
    }
  };

  const deleteNote = (noteId) => {
    const updatedProfile = {
      ...profile,
      notes: profile.notes.filter(note => note.id !== noteId)
    };
    saveProfile(updatedProfile);
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest)) {
      const updatedProfile = {
        ...profile,
        interests: [...profile.interests, newInterest]
      };
      saveProfile(updatedProfile);
      setNewInterest('');
    }
  };

  const removeInterest = (interest) => {
    const updatedProfile = {
      ...profile,
      interests: profile.interests.filter(i => i !== interest)
    };
    saveProfile(updatedProfile);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <div className="profile-header">
          <div className="profile-avatar-large">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=150`}
              alt={user.name}
            />
          </div>
          <h2>{user.name}</h2>
          <p className="user-email">{user.email}</p>
        </div>

        <div className="profile-content">
          <section className="profile-section">
            <div className="section-header">
              <h3>Bio</h3>
              <button 
                className="edit-button"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </div>
            {isEditing ? (
              <textarea
                className="bio-input"
                value={profile.bio}
                onChange={handleBioChange}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="bio-text">
                {profile.bio || "No bio yet. Click edit to add one!"}
              </p>
            )}
          </section>

          <section className="profile-section">
            <h3>Space Interests</h3>
            <div className="interests-container">
              {profile.interests.map(interest => (
                <span key={interest} className="interest-tag">
                  {interest}
                  <button 
                    className="remove-interest"
                    onClick={() => removeInterest(interest)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="add-interest">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add a space interest..."
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
              />
              <button onClick={addInterest}>Add</button>
            </div>
          </section>

          <section className="profile-section">
            <h3>Cosmic Notes</h3>
            <div className="notes-container">
              {profile.notes.map(note => (
                <div key={note.id} className="note-card">
                  <p>{note.text}</p>
                  <div className="note-footer">
                    <span className="note-date">
                      {new Date(note.date).toLocaleDateString()}
                    </span>
                    <button 
                      className="delete-note"
                      onClick={() => deleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="add-note">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a new note..."
              />
              <button onClick={addNote}>Add Note</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

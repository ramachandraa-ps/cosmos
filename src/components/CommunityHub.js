import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createPost, getPosts, getUserProfile } from '../services/firestoreService';
import './CommunityHub.css';

const CommunityHub = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [userProfiles, setUserProfiles] = useState({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      
      // Fetch user profiles for all unique users
      const uniqueUserIds = [...new Set(fetchedPosts.map(post => post.userId))];
      const profiles = {};
      
      for (const userId of uniqueUserIds) {
        const profile = await getUserProfile(userId);
        if (profile) {
          profiles[userId] = profile;
        }
      }
      
      setUserProfiles(profiles);
      setLoading(false);
    } catch (error) {
      console.error("Error loading posts:", error);
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || !user) return;

    try {
      await createPost(user.id, newPost);
      setNewPost('');
      loadPosts(); // Reload posts after creating new one
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="community-hub loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="community-hub">
      <div className="community-header">
        <h1>Community Hub</h1>
        <p>Connect with fellow space enthusiasts</p>
      </div>

      {user ? (
        <form className="post-form" onSubmit={handleSubmitPost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts about space..."
            className="post-input"
          />
          <button type="submit" className="post-button">
            Share Post
          </button>
        </form>
      ) : (
        <div className="login-prompt">
          Please sign in to share your thoughts with the community.
        </div>
      )}

      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-avatar">
                {userProfiles[post.userId]?.name?.charAt(0) || '?'}
              </div>
              <div className="post-meta">
                <div className="post-author">
                  {userProfiles[post.userId]?.name || 'Anonymous'}
                </div>
                <div className="post-time">
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </div>
            <div className="post-content">{post.content}</div>
            <div className="post-footer">
              <button className="like-button">
                ❤️ {post.likes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityHub;

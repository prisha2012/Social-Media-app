import React, { useEffect, useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import DefaultAvatar from '../components/DefaultAvatar';
import './Profile.css';

const Profile = () => {
  const { user, token, login } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [followers, setFollowers] = useState(0); // Mocked for now
  const [following, setFollowing] = useState(0); // Mocked for now
  const [view, setView] = useState('grid');
  const [theme, setTheme] = useState('#2575fc'); // Default theme color

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/profile/${user.id}`);
        setProfile(res.data);
      } catch (err) {
        setError('Failed to load profile');
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await API.get('/posts');
        setPosts(res.data.filter(p => p.author._id === user.id));
      } catch {}
    };
    if (user && token) {
      fetchProfile();
      fetchPosts();
      setBio('This is your bio. Edit your profile to update it.'); // Mocked bio
      setFollowers(123); // Mocked followers
      setFollowing(45); // Mocked following
    }
  }, [user, token]);

  const openEdit = () => {
    setEditUsername(profile.username);
    setEditAvatar(profile.avatar || '');
    setEditOpen(true);
    setEditError('');
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await API.put('/users/profile', { username: editUsername, avatar: editAvatar });
      setProfile(res.data);
      login(res.data, token);
      setEditOpen(false);
    } catch (err) {
      setEditError(err.response?.data?.error || 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  if (!user) return <div>Please log in.</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-container" role="main" aria-label="Profile Page">
      <div className="profile-card" style={{ borderColor: theme, background: 'linear-gradient(120deg, #fff 80%, ' + theme + '11 100%)' }}>
        {profile.avatar ? (
          <img src={profile.avatar} alt="avatar" className="profile-avatar" style={{ borderColor: theme }} />
        ) : (
          <DefaultAvatar size={100} />
        )}
        <div className="profile-theme-picker">
          <label htmlFor="theme-color">Profile Theme:</label>
          <input
            id="theme-color"
            type="color"
            value={theme}
            onChange={e => setTheme(e.target.value)}
            aria-label="Pick profile theme color"
          />
        </div>
        <div className="profile-info">
          <div className="profile-username">{profile.username}</div>
          <div className="profile-email">{profile.email}</div>
          <div className="profile-bio">{bio}</div>
          <div className="profile-stats">
            <span><b>{posts.length}</b> posts</span>
            <span><b>{followers}</b> followers</span>
            <span><b>{following}</b> following</span>
          </div>
        </div>
        <button className="profile-edit-btn" onClick={openEdit} aria-label="Edit Profile">Edit Profile</button>
      </div>
      {editOpen && (
        <div className="profile-edit-modal" role="dialog" aria-modal="true" aria-label="Edit Profile Modal">
          <form className="profile-edit-form" onSubmit={handleEdit}>
            <h3>Edit Profile</h3>
            <input
              type="text"
              value={editUsername}
              onChange={e => setEditUsername(e.target.value)}
              placeholder="Username"
              required
              aria-label="Edit Username"
            />
            <input
              type="text"
              value={editAvatar}
              onChange={e => setEditAvatar(e.target.value)}
              placeholder="Avatar URL"
              aria-label="Edit Avatar URL"
            />
            <div className="profile-edit-actions">
              <button type="button" onClick={() => setEditOpen(false)} disabled={editLoading} aria-label="Cancel Edit">Cancel</button>
              <button type="submit" disabled={editLoading} aria-label="Save Profile">{editLoading ? 'Saving...' : 'Save'}</button>
            </div>
            {editError && <div className="profile-edit-error">{editError}</div>}
          </form>
        </div>
      )}
      <div className="profile-posts">
        <div className="profile-posts-header">
          <h3>Your Posts</h3>
          <div className="profile-view-toggle">
            <button
              className={view === 'grid' ? 'active' : ''}
              aria-label="Grid view"
              onClick={() => setView('grid')}
            >
              &#9632;&#9632;&#9632;
            </button>
            <button
              className={view === 'list' ? 'active' : ''}
              aria-label="List view"
              onClick={() => setView('list')}
            >
              &#9776;
            </button>
          </div>
        </div>
        {posts.length === 0 ? (
          <div className="empty-profile-posts">
            <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true" focusable="false" className="empty-icon"><circle cx="24" cy="24" r="22" fill="#f0f4fa"/><path d="M15 30c0-5 4-9 9-9s9 4 9 9" stroke="#2575fc" strokeWidth="2" fill="none"/><circle cx="19" cy="20" r="2" fill="#2575fc"/><circle cx="29" cy="20" r="2" fill="#2575fc"/></svg>
            <div className="empty-text">You haven't posted anything yet.</div>
          </div>
        ) : view === 'grid' ? (
          <div className="profile-posts-grid">
            {posts.map(post => (
              <div key={post._id} className="profile-post-card">
                {post.image && <img src={post.image} alt="post" className="profile-post-image" />}
                <div className="profile-post-content">{post.content}</div>
                <div className="profile-post-time">{new Date(post.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        ) : (
          posts.map(post => (
            <div key={post._id} className="profile-post-card">
              <div className="profile-post-content">{post.content}</div>
              {post.image && <img src={post.image} alt="post" className="profile-post-image" />}
              <div className="profile-post-time">{new Date(post.createdAt).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile; 
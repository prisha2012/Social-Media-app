import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/register', { username, email, password, avatar });
      setSuccess('Registration successful! Please sign in.');
      setError('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div className="auth-container" role="main" aria-label="Register Page">
      <form className="auth-form" onSubmit={handleSubmit} aria-label="Register Form">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          aria-label="Username"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-label="Email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          aria-label="Password"
        />
        <input
          type="text"
          placeholder="Avatar URL (optional)"
          value={avatar}
          onChange={e => setAvatar(e.target.value)}
          aria-label="Avatar URL (optional)"
        />
        <button type="submit" aria-label="Sign Up">Sign Up</button>
        {success && <div className="auth-success" role="status">{success}</div>}
        {error && <div className="auth-error" role="alert">{error}</div>}
        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 
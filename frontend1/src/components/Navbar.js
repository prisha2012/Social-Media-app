import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DefaultAvatar from './DefaultAvatar';
import './Navbar.css';
import { DarkModeContext } from '../App';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, setDarkMode } = React.useContext(DarkModeContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(open => !open);

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-logo">
        <Link to="/feed" aria-label="Home">SociaLite</Link>
      </div>
      <button
        className="navbar-hamburger"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls="navbar-links"
        aria-expanded={menuOpen}
        onClick={toggleMenu}
      >
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>
      <button
        className="darkmode-toggle"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={() => setDarkMode(dm => !dm)}
      >
        {darkMode ? (
          <span className="icon-moon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15.5 12.5C14.5 13.5 13 14 11.5 14C8.5 14 6 11.5 6 8.5C6 7 6.5 5.5 7.5 4.5C5 5 3 7.2 3 9.9C3 13 5.5 15.5 8.6 15.5C11.3 15.5 13.5 13.5 14 11C14.5 11.5 15 12 15.5 12.5Z" fill="#232526"/></svg>
          </span>
        ) : (
          <span className="icon-sun" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="5" fill="#ffe259"/><g stroke="#ffe259" strokeWidth="2"><line x1="10" y1="1" x2="10" y2="4"/><line x1="10" y1="16" x2="10" y2="19"/><line x1="1" y1="10" x2="4" y2="10"/><line x1="16" y1="10" x2="19" y2="10"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="13.66" y1="13.66" x2="15.78" y2="15.78"/><line x1="4.22" y1="15.78" x2="6.34" y2="13.66"/><line x1="13.66" y1="6.34" x2="15.78" y2="4.22"/></g></svg>
          </span>
        )}
      </button>
      <div
        className={`navbar-links${menuOpen ? ' open' : ''}`}
        id="navbar-links"
        aria-hidden={!menuOpen && window.innerWidth <= 600}
      >
        {user ? (
          <>
            <Link to="/feed" aria-label="Feed" onClick={() => setMenuOpen(false)}>Feed</Link>
            <Link to="/profile" aria-label="Profile" onClick={() => setMenuOpen(false)}>
              <div className="navbar-user">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="navbar-avatar" />
                ) : (
                  <DefaultAvatar size={32} />
                )}
                <span>{user.username}</span>
              </div>
            </Link>
            <button className="navbar-logout" onClick={() => { handleLogout(); setMenuOpen(false); }} aria-label="Logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" aria-label="Login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" aria-label="Register" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 
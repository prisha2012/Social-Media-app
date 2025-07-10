import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import { AuthContext } from './context/AuthContext';
import Notification from './components/Notification';
import Navbar from './components/Navbar';

const DarkModeContext = React.createContext();

const App = () => {
  const { token } = React.useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className={darkMode ? 'dark-mode' : ''}>
        <Router>
          <Navbar />
          <Notification />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feed" element={token ? <Feed /> : <Navigate to="/login" />} />
            <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/profile/:name" element={<PublicProfile />} />
            <Route path="*" element={<Navigate to={token ? "/feed" : "/login"} />} />
          </Routes>
        </Router>
      </div>
    </DarkModeContext.Provider>
  );
};

export { DarkModeContext };
export default App;

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';

const Notification = () => {
  const { user, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user && token) {
      const s = io('http://localhost:5000');
      s.emit('join', user.id);
      s.on('notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });
      return () => s.disconnect();
    }
  }, [user, token]);

  return (
    <div style={{position:'fixed',top:10,right:10,zIndex:1000}}>
      {notifications.map((n, idx) => (
        <div key={idx} style={{background:'#eee',margin:'5px',padding:'10px',border:'1px solid #ccc'}}>
          <b>{n.type.toUpperCase()}</b>: {n.message}
        </div>
      ))}
    </div>
  );
};

export default Notification; 
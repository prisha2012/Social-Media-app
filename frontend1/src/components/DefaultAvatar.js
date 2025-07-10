import React from 'react';

const DefaultAvatar = ({ size = 40 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 700,
      fontSize: size * 0.45,
      border: '2px solid #fff',
      objectFit: 'cover',
      userSelect: 'none',
    }}
  >
    <span role="img" aria-label="user">👤</span>
  </div>
);

export default DefaultAvatar; 
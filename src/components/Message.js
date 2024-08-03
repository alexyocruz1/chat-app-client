import React from 'react';
import '../styles/Message.css';

const Message = ({ message, username, color }) => {
  return (
    <div className="message" style={{ backgroundColor: color }}>
      <p><strong>{username}:</strong> {message}</p>
    </div>
  );
};

export default Message;
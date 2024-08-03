import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Message from './Message';
import randomColor from 'randomcolor';
import '../styles/Chat.css';

const socket = io('https://chat-app-server-xosu.onrender.com');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [userColor, setUserColor] = useState('#FFFFFF'); // Default color
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  useEffect(() => {
    // Fetch existing messages from the server
    fetch('https://chat-app-server-xosu.onrender.com/api/messages')
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error fetching messages:', error));

    // Initialize socket connection
    const socketIo = io('https://chat-app-server-xosu.onrender.com');
    socketIo.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message && isUsernameSet) {
      socket.emit('sendMessage', { text: message, username, color: userColor });
      setMessage('');
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username) {
      // Generate a color based on the username
      const color = randomColor({ seed: username });
      setUserColor(color);
      setIsUsernameSet(true); // Set the username and allow chat
    }
  };

  if (!isUsernameSet) {
    return (
      <div className="username-prompt">
        <form onSubmit={handleUsernameSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} message={msg.text} username={msg.username} color={msg.color} />
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
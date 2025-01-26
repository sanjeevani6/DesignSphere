import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';

const Chat = ({ teamCode, socket }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!teamCode) {
        console.log('No teamCode provided, not joining chat.');
        return;
      }

    // Join the chat room
    socket.emit('joinChat', teamCode);

    // Listen for incoming messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.emit('leaveChat', teamCode);
      socket.off('receiveMessage');
    };
  }, [teamCode, socket]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const chatMessage = {
      teamCode,
      sender: socket.id,
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Emit the message to the server
    socket.emit('sendMessage', chatMessage);

    // Add the message locally
    setMessages((prevMessages) => [...prevMessages, chatMessage]);
    setMessage('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%', // Ensure the chat box takes full width of the container
        height: '100%',
        maxWidth: '100%', // Prevent overflow horizontally
        maxHeight: '100%', // Prevent overflow vertically
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Chat Header */}
      <Typography
        variant="h6"
        sx={{
          backgroundColor: '#A1D1B1',
          color: 'black',
          padding: '8px',
          textAlign: 'center',
          fontSize: '16px',
        }}
      >
        Team Chat
      </Typography>

      {/* Chat Messages */}
      <List
        sx={{
          flexGrow: 1, // Allows this section to expand and take available space
          overflowY: 'auto', // Enable vertical scrolling for long messages
          padding: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        {messages.map((msg, index) => (
          <ListItem key={index} alignItems="flex-start">
            <Avatar sx={{ bgcolor: '#1976d2', marginRight: '8px' }}>
              {msg.sender.charAt(0).toUpperCase()}
            </Avatar>
            <ListItemText
              primary={msg.content}
              secondary={new Date(msg.timestamp).toLocaleTimeString()}
            />
          </ListItem>
        ))}
      </List>

      {/* Chat Input */}
      <Box
        sx={{
          display: 'flex',
          padding: '8px',
          gap: '8px',
          borderTop: '1px solid #ccc',
          backgroundColor: '#f4f4f4',
        //    backgroundColor: '#A1D1B1',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            backgroundColor: 'white',
          }}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          sx={{
            backgroundColor: '#A1D1B1',
            color: 'black',
            '&:hover': {
              backgroundColor: '#A1D1B1',
            },
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
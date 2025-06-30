import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Alert } from '@mui/material';
import MessageForm from './components/MessageForm';

function App() {
  const [lastAction, setLastAction] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  const handleMessageSent = (result, action) => {
    setLastAction(action);
    setLastResult(result);
  };

  const getActionMessage = () => {
    if (!lastAction) return null;
    
    const messages = {
      send: 'Message sent successfully!',
      update: 'Message updated successfully!',
      delete: 'Message deleted successfully!',
      retrieve: 'Message retrieved successfully!'
    };

    return messages[lastAction] || 'Action completed successfully!';
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Slack API Integration
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your Slack messages with ease
        </Typography>
      </Box>

      <MessageForm onMessageSent={handleMessageSent} />

      {lastResult && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Last Action: {lastAction?.charAt(0).toUpperCase() + lastAction?.slice(1)}
          </Typography>
          
          <Alert severity="success" sx={{ mb: 2 }}>
            {getActionMessage()}
          </Alert>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Response Data:
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                bgcolor: 'background.paper',
                maxHeight: 300,
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              }}
            >
              <pre>{JSON.stringify(lastResult, null, 2)}</pre>
            </Paper>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default App;

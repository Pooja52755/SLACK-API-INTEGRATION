import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const MessageForm = ({ onMessageSent }) => {
  const [formData, setFormData] = useState({
    channel: '',
    text: '',
    scheduledTime: null,
    messageTs: ''
  });
  const [action, setAction] = useState('send');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateTimeChange = (date) => {
    setFormData({
      ...formData,
      scheduledTime: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let response;
      const payload = {
        ...formData,
        ts: formData.messageTs, // 👈 required by backend
        scheduledTime: formData.scheduledTime ? formData.scheduledTime.toISOString() : null
      };
      

      switch (action) {
        case 'send':
          response = await axios.post('/api/messages/send', payload);
          break;
        case 'update':
          response = await axios.put('/api/messages/update', payload);
          break;
        case 'delete':
          response = await axios.delete('/api/messages/delete', { data: payload });
          break;
        case 'retrieve':
          response = await axios.get(`/api/messages/${formData.channel}/${formData.messageTs}`);
          break;
        default:
          throw new Error('Invalid action');
      }

      onMessageSent(response.data, action);
      if (action === 'send') {
        setFormData({
          ...formData,
          text: '',
          scheduledTime: null
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Slack Message Manager
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Action</InputLabel>
          <Select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            label="Action"
          >
            <MenuItem value="send">Send/Schedule Message</MenuItem>
            <MenuItem value="update">Update Message</MenuItem>
            <MenuItem value="delete">Delete Message</MenuItem>
            <MenuItem value="retrieve">Retrieve Message</MenuItem>
          </Select>
        </FormControl>

      

        <TextField
          fullWidth
          margin="normal"
          label="Channel ID"
          name="channel"
          value={formData.channel}
          onChange={handleChange}
          required
        />

        {action !== 'delete' && (
          <TextField
            fullWidth
            margin="normal"
            multiline
            rows={4}
            label="Message Text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required={action !== 'retrieve'}
          />
        )}

        {action === 'send' && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box mt={2}>
              <DateTimePicker
                label="Scheduled Time"
                value={formData.scheduledTime}
                onChange={handleDateTimeChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Box>
          </LocalizationProvider>
        )}

        {(action === 'update' || action === 'retrieve' || action === 'delete') && (
          <TextField
            fullWidth
            margin="normal"
            label="Message Timestamp (ts)"
            name="messageTs"
            value={formData.messageTs}
            onChange={handleChange}
            required
          />
        )}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            Error: {error}
          </Typography>
        )}

        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? 'Processing...' : action === 'send' ? 'Send Message' : action === 'update' ? 'Update Message' : action === 'delete' ? 'Delete Message' : 'Retrieve Message'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default MessageForm;

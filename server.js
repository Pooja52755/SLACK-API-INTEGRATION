const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { WebClient } = require('@slack/web-api');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Slack API Integration Server is running' });
});

// ✅ Send or schedule message
app.post('/api/messages/send', async (req, res) => {
  try {
    const { channel, text, scheduledTime } = req.body;

    if (scheduledTime) {
      const timestamp = Math.floor(new Date(scheduledTime).getTime() / 1000);

      const result = await slackClient.chat.scheduleMessage({
        channel,
        text,
        post_at: timestamp,
      });

      res.json({ success: true, type: 'scheduled', data: result });
    } else {
      const result = await slackClient.chat.postMessage({
        channel,
        text,
      });

      res.json({ success: true, type: 'immediate', data: result });
    }
  } catch (error) {
    console.error('Error sending/scheduling message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Retrieve immediate message
app.get('/api/messages/:channel/:ts', async (req, res) => {
  try {
    const { channel, ts } = req.params;

    const result = await slackClient.conversations.history({
      channel,
      latest: ts,
      inclusive: true,
      limit: 1,
    });

    res.json({ success: true, data: result.messages[0] || null });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Update immediate message
app.put('/api/messages/update', async (req, res) => {
  try {
    const { channel, ts, text } = req.body;

    const result = await slackClient.chat.update({
      channel,
      ts,
      text,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Delete message (supports both scheduled and sent)
app.delete('/api/messages/delete', async (req, res) => {
  try {
    const { channel, ts, scheduled_message_id } = req.body;
    let result;

    if (scheduled_message_id) {
      // Delete a scheduled message
      result = await slackClient.chat.deleteScheduledMessage({
        channel,
        scheduled_message_id,
      });
    } else if (ts) {
      // Delete a sent message
      result = await slackClient.chat.delete({
        channel,
        ts,
      });
    } else {
      return res.status(400).json({ success: false, error: 'Provide ts or scheduled_message_id' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Reschedule a message (custom logic)
app.put('/api/messages/reschedule', async (req, res) => {
  try {
    const { channel, scheduled_message_id, newText, newScheduledTime } = req.body;

    // Step 1: Delete original scheduled message
    await slackClient.chat.deleteScheduledMessage({
      channel,
      scheduled_message_id,
    });

    // Step 2: Schedule a new message
    const newTimestamp = Math.floor(new Date(newScheduledTime).getTime() / 1000);

    const result = await slackClient.chat.scheduleMessage({
      channel,
      text: newText,
      post_at: newTimestamp,
    });

    res.json({ success: true, message: 'Rescheduled successfully', data: result });
  } catch (error) {
    console.error('Error rescheduling message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ List scheduled messages for a channel
app.get('/api/messages/scheduled/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    const result = await slackClient.chat.scheduledMessages.list({
      channel: channelId,
      limit: 50 // You can adjust the number
    });

    res.json({ success: true, messages: result.scheduled_messages });
  } catch (error) {
    console.error('Error fetching scheduled messages:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

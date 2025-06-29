# Slack API Integration

A MERN stack application that demonstrates integration with Slack's messaging API, allowing you to send, retrieve, update, and delete messages in Slack channels.

## Features

- **Authentication**: Secure OAuth2 authentication with Slack
- **Message Operations**:
  - Send messages to Slack channels
  - Schedule messages for future delivery
  - Retrieve messages by timestamp
  - Update existing messages
  - Delete messages

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Slack Workspace with admin access
- Slack App with necessary permissions (chat:write, chat:write.public, chat:write:bot)

## Setup Instructions

### 1. Create a Slack App

1. Go to [Slack API](https://api.slack.com/apps) and click "Create New App"
2. Choose "From scratch" and enter your app name and workspace
3. Navigate to "OAuth & Permissions" in the sidebar
4. Under "Scopes", add the following bot token scopes:
   - `chat:write`
   - `chat:write.public`
   - `channels:history`
   - `channels:read`
   - `groups:history`
   - `im:history`
   - `mpim:history`
5. Install the app to your workspace
6. Copy the "Bot User OAuth Token" (starts with `xoxb-`)

### 2. Configure Environment Variables

1. Create a `.env` file in the root directory
2. Add the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   SLACK_BOT_TOKEN=your-bot-token-here
   ```
   Replace `your-bot-token-here` with the Bot User OAuth Token you copied earlier.

### 3. Install Dependencies

In the root directory, run:
```bash
npm install
cd client
npm install
cd ..
```

## Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   npm run server
   ```
   This will start the backend server on port 5000.

2. In a new terminal, start the React development server:
   ```bash
   cd client
   npm start
   ```
   This will open the application in your default browser at `http://localhost:3000`.

### Production Build

1. Build the React application:
   ```bash
   cd client
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```
   The application will be served from the `build` directory on port 5000.

## Usage

1. **Send a Message**:
   - Enter the channel ID
   - Type your message
   - (Optional) Set a schedule time
   - Click "Send Message"

2. **Retrieve a Message**:
   - Select "Retrieve Message" from the action dropdown
   - Enter the channel ID and message timestamp (ts)
   - Click "Retrieve Message"

3. **Update a Message**:
   - Select "Update Message" from the action dropdown
   - Enter the channel ID, message timestamp (ts), and new message text
   - Click "Update Message"

4. **Delete a Message**:
   - Select "Delete Message" from the action dropdown
   - Enter the channel ID and message timestamp (ts)
   - Click "Delete Message"

## API Endpoints

- `POST /api/messages/send` - Send or schedule a message
- `GET /api/messages/:channel/:ts` - Retrieve a message
- `PUT /api/messages/update` - Update a message
- `DELETE /api/messages/delete` - Delete a message

## Security Considerations

- Keep your Slack bot token secure and never commit it to version control
- The `.env` file is included in `.gitignore` by default
- For production use, consider implementing user authentication and proper error handling

## Troubleshooting

- If you get rate-limited by Slack, wait a minute and try again
- Ensure your bot has been added to the channels you're trying to post to
- Check the browser's developer console and the server logs for error messages

## License

This project is open source and available under the MIT License.

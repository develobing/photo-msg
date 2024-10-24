// Static Express server
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const fs = require('fs');

// Create HTTP server
const app = express();
const server = http.Server(app);

// Create Socket.io server
const io = socketio(server);

// Init server messages from disk
const messageFilePath = `${__dirname}/db.json`;
const messages = getFileData(messageFilePath);

// Listen for new socket client (connection)
io.on('connection', (socket) => {
  // Send all messages to connecting client
  socket.emit('all_messages', messages);

  // Listen for new messages
  socket.on('new_message', (message) => {
    // Add to messages
    messages.unshift(message);

    // Broadcast new message to all connected clients
    socket.broadcast.emit('new_message', message);

    // Persist to disk
    saveFileData(messageFilePath, messages);
  });
});

// Server "app" directory
app.use(express.static(`${__dirname}/../app`));

// Server "app" directory
app.use('/modules', express.static(`${__dirname}/../node_modules`));

// Start server
const port = 8000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Utility functions
function getFileData(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    return [];
  }
}

function saveFileData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

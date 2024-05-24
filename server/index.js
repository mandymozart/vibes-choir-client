const path = require('path');
// Define a PORT variable for the server
const PORT = 3000;
const HOST = '127.0.0.1';
const ALLOW_ORIGIN = '*';
// const ALLOW_ORIGIN = "https://viennastruggle.com"

// Import the Express package and initialize the app object
const express = require('express');
const app = express();

// Initialize a basic HTTP server to be used by Socket.IO
// TODO: RUN HTTPS for cross domain https://akshitb.medium.com/how-to-run-https-on-localhost-a-step-by-step-guide-c61fde893771
const http = require('http');
const server = http.createServer(app);

// Create a Socket.IO server with the HTTP server
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: ALLOW_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

// Serve static files from the public/ directory

app.use(express.static(path.join(__dirname, '/../vanilla/public')));
console.log(path.join(__dirname, '/../vanilla/public'));
// Wrap data in carrier message
function makeMessage(socket, data) {
  return { clientId: socket.id, data: data };
}

// List to store the last 100 messages
let cachedMessages = [];

// Function to add a message to the cache
const addMessageToCache = (message) => {
  cachedMessages.push(message);
  if (cachedMessages.length > 100) {
    cachedMessages.shift(); // Remove the oldest message to keep the size to 100
  }
};

// Have Socket.IO listen for socket connections
io.on('connection', async (socket) => {
  console.log('Connection made');
  socket.on('disconnect', () => {
    console.log('Disconnected client');
    socket.broadcast.emit('disconnected', {});
  });

  socket.on('host', (options) => {
    console.log('User hosted session ', options);
    socket.broadcast.emit('host', makeMessage(socket, options));
  });

  socket.on('join_session', (session) => {
    console.log(`User joined:`, session);
    socket.broadcast.emit(
      'joined_session',
      makeMessage(socket, {
        clientId: socket.id,
        cachedMessages: cachedMessages,
      }),
    );
  });

  socket.on('midi_message', async (midimessage) => {
    console.log('Received MIDI message:', midimessage);
    addMessageToCache(midimessage);
    // Forward the MIDI message to all connected clients except the sender
    socket.broadcast.emit('midi_message', makeMessage(socket, midimessage));
  });
});

// Start up the HTTP server on the given port
server.listen(PORT, HOST, function () {
  console.log(`The server is listening on ${HOST}:${PORT}`);
});

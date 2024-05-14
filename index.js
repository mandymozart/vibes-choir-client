// Define a PORT variable for the server
const PORT = 3000;
const ALLOW_ORIGIN = "*"
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
const io = new Server(server,{
  cors: {
    origin: ALLOW_ORIGIN,
    methods: ["GET", "POST"]
  }
});

// Serve static files from the public/ directory
app.use(express.static('public'));

// Wrap data in carrier message
function makeMessage(socket, data) {
  return { clientId: socket.id, data: data };
}

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

  socket.on('join', (group) => {
    console.log('User joined group ' + group);
    socket.broadcast.emit('join', makeMessage(socket, options));
  });

  socket.on('switch', (group) => {
    console.log('User switched to group ' + group);
    socket.broadcast.emit('switch', makeMessage(socket, group));
  });

  socket.on('midi_message', async (midimessage) => {
    console.log('Received MIDI message:', midimessage);
    // Forward the MIDI message to all connected clients except the sender
    socket.broadcast.emit('midi_message', makeMessage(socket, midimessage));
  });
});

// Start up the HTTP server on the given port
server.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

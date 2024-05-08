// Define a PORT variable for the server
const PORT = 3000;

// Import the Express package and initialize the app object
const express = require('express');
const app = express();

// Initialize a basic HTTP server to be used by Socket.IO
const http = require('http');
const server = http.createServer(app);

// Create a Socket.IO server with the HTTP server
const { Server } = require('socket.io');
const io = new Server(server);

// Import the custom chatbot module
const chatbot = require('./chatbot');

// Serve static files from the public/ directory
app.use(express.static('public'));

// Have Socket.IO listen for socket connections
io.on('connection', (socket) => {
    console.log('Connection made');

    // Define handling for new messages
    socket.on('newmessage', async (messageObject) => {
        console.log('Message received:\n\t' + messageObject.body);

        // Broadcast the message to all sockets
        io.emit('newmessage', messageObject);

        // Fetch a response from the chatbot, and broadcast that response
        botResponse = await chatbot.getResponse({ sender: messageObject.user, message: messageObject.body })
            .then((responses) => {
                for (response of responses) {
                    console.log('Bot message of:\n\t' + response);

                    io.emit('botmessage', { user: 'ChatFriend', body: response });
                }
            })
    });

    // Define handling for disconnects
    socket.on('disconnect', () => {
        console.log('Disconnected user');
    });
});

// Start up the HTTP server on the given port
server.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
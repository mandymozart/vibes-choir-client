// Create a socket from the Socket.IO module
var socket = io("vibes-choir-client.onrender.com", {transports: ['websocket']});;

// Assign variables for elements of the page for easy access
var messageUser = document.getElementById('messageUser');
var messageBody = document.getElementById('messageBody');
var errorMessage = document.getElementById('errorMessage');
var messageField = document.getElementById('messageField');

// Define a function to handle inbound 'newmessage' communications on the
// socket; render an <li> element for each
socket.on('newmessage', (messageObject) => {
    var messageElement = document.createElement('li');
    messageElement.innerHTML = "<strong>" + messageObject.user + ":</strong> " + messageObject.body;

    messageField.appendChild(messageElement);
});

// Define a function to handle inbound 'botmessage' communications; render
// these similarly, but with an additional class for visual distinction
socket.on('botmessage', (messageObject) => {
    var messageElement = document.createElement('li');
    messageElement.classList.add('botMessage');
    messageElement.innerHTML = "<strong>" + messageObject.user + ":</strong> " + messageObject.body;

    messageField.appendChild(messageElement);
});

// Define a function for sending a message; this function gets called
// when the user presses the 'Send' button
const sendMessage = () => {
    if (messageUser.value != '' && messageBody.value != '') {
        errorMessage.innerHTML = '';

        socket.emit('newmessage', { user: messageUser.value, body: messageBody.value });

        messageBody.value = '';
    } else {
        errorMessage.innerHTML = 'Please complete the form to send a message';
    }
}
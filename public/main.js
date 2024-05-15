// const SOCKET_URI = null;
const SOCKET_URI = 'vibes-choir-client.onrender.com'
let role; // main, group
let group = 0; // index empty if main

const rootEl = document.querySelector('#app');
const connectionIndicatorEl = document.querySelector('#connectionIndicator')

let socket = io(SOCKET_URI);

let socketConnected = false;
rootEl.classList.add('connecting')
socket.on('connect', () => {
  console.log('Connected to server');
  rootEl.classList.add('ready')
  rootEl.classList.remove('connecting')
  socketConnected = true;
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
  rootEl.classList.remove('ready')
  rootEl.classList.add('disconnected')
  socketConnected = false;
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
  // Handle connection error
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  rootEl.classList.add('disconnected')
  rootEl.classList.add('error')
  // Handle connection error
});

socket.on('connect_timeout', () => {
  console.error('Connection timed out');
  rootEl.classList.add('disconnected')
  rootEl.classList.add('error')
  // Handle connection timeout
});
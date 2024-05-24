import { io } from 'socket.io-client';
const URI = import.meta.env.VITE_SOCKET_URI;
console.log('Connecting to socket at:', URI);
export const socket = io(URI);

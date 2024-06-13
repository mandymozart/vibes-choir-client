import { io } from 'socket.io-client';
const { SOCKET_URI } = import.meta.env;
console.log('Connecting to socket at:', SOCKET_URI);
export const socket = io(SOCKET_URI);

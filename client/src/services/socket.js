import { io } from 'socket.io-client';

// Connect to current origin
const socket = io(window.location.origin, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;

import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (serverURL, options = {}) => {
  if (socket?.connected) {
    return socket;
  }

  const defaultOptions = {
    withCredentials: true,
    autoConnect: false, // Manual control as per best practices
  };

  socket = io(serverURL, { ...defaultOptions, ...options });

  return socket;
};

export const getSocket = () => socket;

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

// Clean up socket instance
export const destroySocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

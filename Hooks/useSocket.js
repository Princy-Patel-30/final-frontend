import { useEffect, useState, useCallback } from 'react';
import {
  initializeSocket,
  getSocket,
  connectSocket,
  disconnectSocket,
} from '../../Utils/Socket';

export const useSocket = (serverURL, userId) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId || !serverURL) return;

    const socket = initializeSocket(serverURL);

    const onConnect = () => {
      setIsConnected(true);
      socket.emit('join', userId);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    connectSocket();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      disconnectSocket();
    };
  }, [serverURL, userId]);

  return {
    socket: getSocket(),
    isConnected,
  };
};

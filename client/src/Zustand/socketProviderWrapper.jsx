import React, { useEffect } from 'react';
import useSocketStore from './useSocket';
import useAuthStore from './useAuthStore';

const SocketProviderWrapper = ({ children }) => {
    const authUser = useAuthStore(state => state.authUser); 
    const { initializeSocket, closeSocket, socket } = useSocketStore();

    useEffect(() => {
        if (authUser) {
            const userId = authUser.user?._id; // Use optional chaining for safety
            if (userId) {
              console.log(`Initializing socket for user: ${userId}`);
                initializeSocket(userId);
            }
        } else {
            closeSocket();
        }

        return () => {
          console.log("Closing socket");
            closeSocket();
        };
    }, [authUser, initializeSocket, closeSocket]);

    useEffect(() => {
        if (socket) {
            console.log('Socket initialized:', socket.id);
        } else {
          console.log('Socket not initialized');
      }
    }, [socket]);

    return <>{children}</>; // Use fragment for children
};

export default SocketProviderWrapper;

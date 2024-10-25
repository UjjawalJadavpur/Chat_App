import React, { useEffect } from 'react';
import useSocketStore from '../Zustand/useSocket.jsx'
import useConversation from '../Zustand/userConversation.jsx';
import { Socket } from 'socket.io-client';

function useGetSocketMessage() {
    const {socket} = useSocketStore();
    const {messages, setMessages } = useConversation();

    useEffect(() => {
        if (!socket) {
            console.warn('Socket is not initialized');
            return; 
        }

        const handleNewMessage = (newMessage) => {
            console.log("Received newMessage :  -",newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);       
        };

        socket.on("newMessage", handleNewMessage);
        
        return () => {
            socket.off("newMessage", handleNewMessage); 
        };
    }, [socket, setMessages]);

    return null;
};

export default useGetSocketMessage;

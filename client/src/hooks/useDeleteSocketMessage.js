import { useEffect } from 'react';
import useSocketStore from '../Zustand/useSocket.jsx';
import useConversation from '../Zustand/userConversation.jsx';

function useDeleteSocketMessage() {
  const { socket } = useSocketStore();
  const { setMessages } = useConversation();

  useEffect(() => {
    if (!socket) {
      console.warn('Socket is not initialized');
      return;
    }

    const handleMessageDeletion = (updatedMessage) => {
      console.log("Received message deletion update: ", updatedMessage);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage.messageId
            ? { ...msg, deleteFlags: updatedMessage.deleteFlags }
            : msg
        )
      );
    };

    socket.on("messageDeleted", handleMessageDeletion);

    return () => {
      socket.off("messageDeleted", handleMessageDeletion);
    };
  }, [socket, setMessages]);
}

export default useDeleteSocketMessage;

import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import useConversation from '../Zustand/userConversation';

function useDeleteMessage() {
  const { messages, setMessages, selectedConversation } = useConversation();

  const deleteMessageForMe = async (messageId) => {
    try {
      const token = Cookies.get('jwt');
      // const userId = selectedConversation._id;
      const storedData = JSON.parse(localStorage.getItem('Chat_App')) || {};
      const userId = storedData.user?._id || null;

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                deleteFlags: [...(msg.deleteFlags || []), { userId , type: 'forMe' }],
              }
            : msg
        )
      );

      await axios.delete(`http://localhost:5017/message/deleteForMe/${messageId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Message deleted for me',userId);
    } catch (error) {
      console.log('Error deleting message for me:', error.message);
    }
  };


  const deleteMessageForEveryone = async (messageId) => {
    try {
      const token = Cookies.get('jwt');

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                deleteFlags: [...(msg.deleteFlags || []), { userId: msg.senderId, type: 'forEveryone' }],
              }
            : msg
        )
      );

      await axios.delete(`http://localhost:5017/message/deleteForEveryone/${messageId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Message deleted for everyone');
    } catch (error) {
      console.log('Error deleting message for everyone:', error.message);
    }
  };

  return { deleteMessageForMe, deleteMessageForEveryone };
}

export default useDeleteMessage;

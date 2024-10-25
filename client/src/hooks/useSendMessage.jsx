import React, {useState} from 'react';
import useConversation from '../Zustand/userConversation'; 
import axios from 'axios';
import Cookies from 'js-cookie';

function useSendMessage() {

  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  console.log("zustand before try- messages :", messages);

  const sendMessage = async(message) => {
    setLoading(true);
    try{
        const token = Cookies.get('jwt');
        const res = await axios.post(`http://localhost:5017/message/send/${selectedConversation._id}`,{
         message ,
        }, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
    });
    // console.log('res.data - Message response:', res.data);

      setMessages((prevMessages) => [...prevMessages, res.data.newMessage]);
      setLoading(false);
    }
    catch(error) {
        console.log("Error in sending messages",error.message);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    } 
    finally {
        setLoading(false);
    }
  };
  return {loading, sendMessage };
}

export default useSendMessage;

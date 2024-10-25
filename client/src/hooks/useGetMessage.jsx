import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import useConversation from '../Zustand/userConversation.jsx';
import api from '../api.js';

function useGetMessage() {

    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation, setSelectedConversation } = useConversation();

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            setMessages([]); 

            if (selectedConversation) {
                const storedConversationId = selectedConversation._id;
                try {
                    const token = Cookies.get('jwt');
                    const res = await api.get(`message/get/${storedConversationId}`, {
                        withCredentials: true,
                    });
                    // console.log("Response from server:", res);
                    if (Array.isArray(res.data)) {
                        // console.log("Array before setting messages:", messages, res.data);
                         setMessages((prevMessages) => [...prevMessages, ...res.data]);
            
                    } else {
                        console.warn("Received data is not an array:", res.data);
                        setMessages([]); 
                    }
                } catch (error) {
                    console.log("Error in getting Messages", error);
                    setLoading(false);
                }
                finally {
                    setLoading(false);
                    console.log("finally");
                }
            } else {
                setMessages([]);
                setLoading(false);
                console.log("else ..No selected Conversation");
            }
        };
        getMessages();
    }, [setMessages, selectedConversation ]);
    return { loading, messages };
};

export default useGetMessage;

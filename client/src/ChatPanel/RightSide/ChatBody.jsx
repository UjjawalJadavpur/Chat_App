import React, { useEffect } from 'react';
import ChatFeed from './ChatFeed.jsx';
import useConversation from '../../Zustand/userConversation.jsx';
import useSocketStore from '../../Zustand/useSocket.jsx';

function ChatBody() {

    const { selectedConversation } = useConversation();
    const { onlineUsers } = useSocketStore();

    const storedData = JSON.parse(localStorage.getItem("Chat_App")) || {};
    // const loggedInUserName = storedData.user.userName;
    const loggedInUserName = storedData.user ? storedData.user.userName : null;
    console.log("storeddata : - ", storedData.user);

    // console.log("Chat Body selected Conversation :- ", selectedConversation);
    const isValidConversation = selectedConversation && selectedConversation.userName;

    const isOnline = isValidConversation && onlineUsers.includes(selectedConversation._id);

    return (
        <div className='chatBody'>
            <div className='headerchatBody'>
                {isValidConversation ? (
                    <p>
                        {/* Receiver : */}
                        <img
                            src={selectedConversation.profilePic}  // Use the saved URL from MongoDB
                            alt={`${selectedConversation.userName}'s profile`}
                            className="headerProfilePic"
                        />
                        <strong>{selectedConversation.userName}</strong>
                        <span className={`statusText ${isOnline ? 'online' : 'offline'}`}>
                            {isOnline ? ' (Online)' : ' (Offline)'}
                        </span>
                    </p>
                ) : (
                    <p> 
                        Welcome 
                        <img
                            src={storedData.user.profilePic}  // Use the saved URL from MongoDB
                            alt={`${storedData.user.userName}'s profile`}
                            className="headerLoggedInProfilePic"
                        />
                        <strong><i>{loggedInUserName}</i></strong>  
                    </p>
                )}
            </div>
            {isValidConversation ? (
                <ChatFeed />
            ) : (
                <div className='noConversation'>
                    <p>Please Select a conversation from the list to start chatting.</p>
                </div>
            )}
        </div>
    );
}

export default ChatBody

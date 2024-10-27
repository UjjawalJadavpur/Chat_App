import React from 'react'
import useConversation from '../../Zustand/userConversation.jsx';
import useSocketStore from '../../Zustand/useSocket.jsx';
import { format } from 'date-fns';

function HeaderChatBody() {

    const { selectedConversation } = useConversation();
    const { onlineUsers } = useSocketStore();

    const storedData = JSON.parse(localStorage.getItem("Chat_App")) || {};
    const loggedInUserName = storedData.user ? storedData.user.userName : null;
    console.log("storeddata : - ", storedData.user);

    // console.log("Chat Body selected Conversation :- ", selectedConversation);
    const isValidConversation = selectedConversation && selectedConversation.userName;
    const isOnline = isValidConversation && onlineUsers.includes(selectedConversation._id);

    const formatLastSeenTime = (lastSeen) => {
        const now = new Date();
        const lastSeenDate = new Date(lastSeen);

        const isToday = lastSeenDate.toDateString() === now.toDateString();
        if (isToday) {
            return 'Last seen: Today';
        }

        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (lastSeenDate.toDateString() === yesterday.toDateString()) {
            return 'Last seen: Yesterday';
        }
        return `Last seen: ${format(lastSeenDate, 'EEE, dd MMM yyyy, hh:mm a')}`;
    };

    return (
        <div className='headerchatBody'>
            {isValidConversation ? (
                <p>
                    {/* Receiver : */}
                    <img
                        src={selectedConversation.profilePic}  // Use the saved URL from MongoDB
                        alt={`${selectedConversation.userName}'s profile`}
                        className="headerProfilePic"
                    />
                    <div className='userInfo'>
                        <strong>{selectedConversation.userName}</strong>
                        <span className={`statusText ${isOnline ? 'online' : 'offline'}`}>
                            {isOnline ? ' (Online)' : formatLastSeenTime(selectedConversation.lastSeen)}
                        </span>
                    </div>
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
    )
}

export default HeaderChatBody

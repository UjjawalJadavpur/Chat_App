import React from 'react';
import ChatFeed from './ChatFeed.jsx';
import useConversation from '../../Zustand/userConversation.jsx';
import HeaderChatBody from './HeaderChatBody.jsx';

function ChatBody() {

    const { selectedConversation } = useConversation();
    const isValidConversation = selectedConversation && selectedConversation.userName;

    return (
        <div className='chatBody'>
            <HeaderChatBody/>
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

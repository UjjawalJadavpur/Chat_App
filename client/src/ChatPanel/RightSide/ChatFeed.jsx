import React, { useEffect, useRef, useState } from 'react';
import useGetMessage from '../../hooks/useGetMessage.jsx';
import useGetSocketMessage from '../../hooks/useGetSocketMessage.jsx';
import useDeleteMessage from '../../hooks/useDeleteMessage.js';
import useMessageStore from '../../Zustand/useMessageStore.jsx';
import { FaAngleDown } from 'react-icons/fa';
import useDeleteSocketMessage from '../../hooks/useDeleteSocketMessage.js';

function ChatFeed() {
  const { loading, messages } = useGetMessage();
  const { optimisticMessage } = useMessageStore();
  const { deleteMessageForMe, deleteMessageForEveryone } = useDeleteMessage();
  const lastMsgRef = useRef(null);
  const [showOptions, setShowOptions] = useState(null);

  useGetSocketMessage();
  useDeleteSocketMessage();

  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, optimisticMessage]);

  const storedData = JSON.parse(localStorage.getItem('Chat_App')) || {};
  const storedUserId = storedData.user?._id || null;

  const hasMessages = Array.isArray(messages) && messages.length > 0;

  const handleDeleteForMeClick = (messageId) => {
    deleteMessageForMe(messageId);
  };

  const handleDeleteForEveryoneClick = (messageId) => {
    deleteMessageForEveryone(messageId);
  };


  return (
    <div className='msgContainer'>
      {loading ? (
        <p>Loading messages...</p>
      ) : hasMessages || optimisticMessage ? (
        <div>
          <h5>Messages:</h5>
          <ul className='msgList'>

            {messages
              .filter(
                (message) =>
                  !message.deleteFlags?.some(
                    (flag) => flag.userId === storedUserId && flag.type === 'forMe'
                  ) && !message.deleteFlags?.some((flag) => flag.type === 'forEveryone')
              )
              .map((message, index) => {
                const isCurrentUser = storedUserId && message.senderId === storedUserId;
                return (
                  <li
                    key={message._id || index}
                    ref={index === messages.length - 1 ? lastMsgRef : null}
                    className={isCurrentUser ? 'msgSenderContainer' : 'msgReceiverContainer'}
                  >
                    <div className={isCurrentUser ? 'msgSender' : 'msgReceiver'}>
                      <div className='msgText'>{message.message}</div>
                      <div className='msgOptions'>
                        <FaAngleDown
                          className='optionsBtn'
                          onClick={() => setShowOptions(showOptions === message._id ? null : message._id)}
                        />
                        {showOptions === message._id && (
                          <div className='optionsMenu'>
                            <button className='optionItem'>Edit</button>
                            <button className='optionItem' onClick={() => handleDeleteForMeClick(message._id)}>
                              Delete for Me
                            </button>
                            {isCurrentUser && (
                              <button className='optionItem' onClick={() => handleDeleteForEveryoneClick(message._id)}>
                                Delete for Everyone
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='msgTime'>{new Date(message.createdAt).toLocaleTimeString()}</div>
                  </li>
                );
              })}


            {optimisticMessage.map((optimisticMessage, index) => (
              <li
                key={optimisticMessage._id} //  || `optimistic-${index}`}
                ref={lastMsgRef}
                className='msgSenderContainer'
              >
                <div className='msgSender'>
                  <div className='msgText'>{optimisticMessage.message}</div>
                </div>
                <div><em>(sending...)</em></div>
                {/* <div className='msgTime'>{new Date(optimisticMessage.createdAt).toLocaleTimeString()}</div> */}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <p>Say Hi to start the conversation</p>
        </div>
      )}
    </div>
  );
}

export default ChatFeed;

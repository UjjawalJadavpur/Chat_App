import React, { useState, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import useSendMessage from '../../hooks/useSendMessage.jsx';
import useMessageStore from '../../Zustand/useMessageStore.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


function Footer() {
  const { sendMessage } = useSendMessage();
  const { addOptimisticMessage, clearOptimisticMessage } = useMessageStore();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const selectedReceiver = JSON.parse(localStorage.getItem('selectedReceiver'));
  const receiverId = selectedReceiver?._id;


  useEffect(() => {
    if (receiverId) {
      const savedMessage = localStorage.getItem(receiverId);
      setMessage(savedMessage ? JSON.parse(savedMessage) : '');
    } else {
      setMessage('');
    }
  }, [receiverId]);


  const saveMessageToLocalStorage = (newMessage) => {
    if (receiverId) {
      localStorage.setItem(receiverId, JSON.stringify(newMessage));
    }
  };

  const handleInputChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    saveMessageToLocalStorage(newMessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const optimisticMessage = {
        _id: `optimistic-${Date.now()}`,
        message,
        senderId: JSON.parse(localStorage.getItem('Chat_App'))?.user?._id, //  || 'currentUser',
        // createdAt: new Date().toISOString(),
        status: 'sending',
      };

      addOptimisticMessage(optimisticMessage);
      setMessage('');

      try {
        const confirmedMessage = await sendMessage(message);
        console.log("confirmedMessage : ", confirmedMessage);

        clearOptimisticMessage();
        localStorage.removeItem(receiverId);

      } catch (error) {
        console.error('Failed to send message:', error);
      }
      setMessage('');
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    console.log("Event:", event);
    console.log("Event.emoji:", event.emoji);
    console.log("Emoji Object:", emojiObject);

    const newMessage = message + event.emoji;
    setMessage(newMessage);

    saveMessageToLocalStorage(newMessage);
    setShowEmojiPicker(false);
  };


  return (
    <div className='footer'>
      <div className='footerContainer'>
        <textarea
          placeholder='Type your Message here'
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          rows={1}
          style={{ resize: 'none' }}
        />
        <button
          className="emojiBtn"
          onClick={() => {
            console.log('Emoji button clicked');
            setShowEmojiPicker((prev) => {
              console.log('Toggling emoji picker: ', !prev);
              return !prev;
            });
          }}
        >
          😊
        </button>

        {showEmojiPicker && (
          <div className="emojiPicker">
            {console.log('Emoji picker is visible')}
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}

        <button className='sendMsg' onClick={handleSubmit}>
          {/* <FontAwesomeIcon icon="fa-solid fa-paper-plane" /> */}
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}

export default Footer;

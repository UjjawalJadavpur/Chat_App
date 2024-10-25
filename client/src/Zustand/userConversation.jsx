import { create } from 'zustand';

const useConversation = create((set) => {
  const storedReceiver = localStorage.getItem('selectedReceiver');
  // console.log("storedReceiver : ",storedReceiver);
  const initialConversation = storedReceiver ? JSON.parse(storedReceiver) : null;

  return {
    selectedConversation: initialConversation,
    setSelectedConversation: (selectedConversation) => {
      set({ selectedConversation });
      if (selectedConversation) {
        localStorage.setItem('selectedReceiver', JSON.stringify(selectedConversation));
        // console.log("selectedConversation set to :-", selectedConversation);
      } else {
        localStorage.removeItem('selectedReceiver');
      }
    },
    messages: [],
    setMessages: (newMessages) => {
      set((state) => {
        const updatedMessages = typeof newMessages === 'function' ? newMessages(state.messages) : newMessages;
        // console.log("Messages updated:", updatedMessages);
        return { messages: updatedMessages };
      });
    },
  };
});

export default useConversation;

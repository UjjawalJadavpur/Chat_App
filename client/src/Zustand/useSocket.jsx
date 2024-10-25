import { create } from 'zustand';
import io from 'socket.io-client';

const useSocketStore = create((set) => ({

  socket: null,
  onlineUsers: [],
  initializeSocket: (userId) => {
    const socket = io("http://localhost:5017", {
      query: { userId },
      withCredentials: true,
    });

    socket.on("connect", () => {
        console.log(`Connected to server: ${socket.id}`);
        set({ socket });
    });
    
    socket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Disconnected from server: ${socket.id} ${reason}`);
      set({ socket: null }); // Clear socket on disconnect
    });

    //set({ socket });

    return socket;
  },
  closeSocket: () => {
    set((state) => {
      if (state.socket) {
        state.socket.close();
        return { socket: null };
      }
      return {};
    });
  },
  isUserOnline : (userId) => {
    return (state) => state.onlineUsers.includes(userId);
  },
}));

export default useSocketStore;

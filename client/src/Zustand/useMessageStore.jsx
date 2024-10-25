import { create } from 'zustand';

const useMessageStore = create((set) => ({
  
  optimisticMessage: [],

  addOptimisticMessage: (message) => {
    set((state) => ({
      optimisticMessage: [...state.optimisticMessage, message],
    }));
  },

  clearOptimisticMessage: () => {
    set({ optimisticMessage: [] }); 
  },
}));

export default useMessageStore;

import { create } from 'zustand';
import Cookies from 'js-cookie';

const useAuthStore = create((set) => ({
    authUser: Cookies.get('jwt') ? JSON.parse(localStorage.getItem('Chat_App')) : undefined,
    setAuthUser: (user) => {
       set({ authUser: user }); // Update Zustand state         
    }
}));

export default useAuthStore;

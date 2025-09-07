import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useUserStore = create((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    try {
      const res = await axios.get(`${API_URL}/me`, { withCredentials: true });
      set({ user: res.data, loading: false });
    } catch (err) {
      set({ user: null, loading: false });
      console.log(err);
    }
  },

  setUser: (user) => set({ user }),

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({ user: null });
    }
  },
}));

export default useUserStore;

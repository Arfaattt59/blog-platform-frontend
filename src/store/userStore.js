// file: frontend/src/store/userStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null, // Initially, no user is logged in
      addUser: (userData) => set({ user: userData }),
      removeUser: () => set({ user: null }), // For logout
    }),
    {
      name: 'user-storage', // Name for the storage in localStorage
    }
  )
);

export default useUserStore;
import { create } from 'zustand';
import { User } from '../types/user';
import { devtools, persist } from 'zustand/middleware';

export interface UserState {
  user: User | null;
  login: (_newUser: User) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        login: (newUser: User) => set(() => ({ user: newUser })),
        logout: () => set(() => ({ user: null })),
      }),
      {
        name: 'userStore',
      },
    ),
  ),
);

export default useUserStore;

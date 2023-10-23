import { create } from 'zustand';
import { User } from '../types/user';
import { devtools, persist } from 'zustand/middleware';

export interface UserState {
  user: User | null;
  loggingIn: boolean;
}

export interface UserActions {
  update: (_newUser: User) => void;
  logout: () => void;
  startLoggingIn: () => void;
}

const initialState: UserState = {
  user: null,
  loggingIn: true,
};

const useUserStore = create<UserState & UserActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        startLoggingIn: () => set(() => ({ loggingIn: true })),
        update: (newUser: User) => set(() => ({ user: newUser, loggingIn: false })),
        logout: () => set(() => ({ ...initialState, loggingIn: false })),
      }),
      {
        name: 'userStore',
      },
    ),
  ),
);

export default useUserStore;

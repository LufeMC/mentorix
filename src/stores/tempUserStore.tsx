import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TempUser } from '../types/tempUser';

export interface TempUserState {
  tempUser: TempUser | null;
  tempLoggingIn: boolean;
}

export interface TempUserActions {
  tempUpdate: (_newTempUser: TempUser) => void;
  tempLogout: () => void;
  tempStartLoggingIn: () => void;
  tempDoneLoggingIn: () => void;
}

const initialState: TempUserState = {
  tempUser: null,
  tempLoggingIn: true,
};

const useTempUserStore = create<TempUserState & TempUserActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        tempStartLoggingIn: () => set(() => ({ tempLoggingIn: true })),
        tempDoneLoggingIn: () => set(() => ({ tempLoggingIn: false })),
        tempUpdate: (newTempUser: TempUser) => set(() => ({ tempUser: newTempUser, tempLoggingIn: false })),
        tempLogout: () => set(() => ({ ...initialState, tempLoggingIn: true })),
      }),
      {
        name: 'userStore',
      },
    ),
  ),
);

export default useTempUserStore;

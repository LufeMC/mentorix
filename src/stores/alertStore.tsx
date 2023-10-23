import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const alertTypes = {
  success: 'success',
  error: 'error',
  warning: 'warning',
};

export interface Alert {
  message: string;
  type: keyof typeof alertTypes;
}

export interface AlertState {
  alert: Alert | null;
  alertTimeout: NodeJS.Timeout | null;
  started: boolean;
  changeAlert: (_newAlert: Alert, _newAlertTimeout: NodeJS.Timeout) => void;
  resetAlert: () => void;
}

const useAlertStore = create<AlertState>()(
  devtools(
    persist(
      (set) => ({
        alert: null,
        alertTimeout: null,
        started: false,
        changeAlert: (newAlert: Alert, newAlertTimeout: NodeJS.Timeout) =>
          set((state) => {
            if (state.alertTimeout !== null) {
              clearTimeout(state.alertTimeout);
            }

            return { alert: newAlert, alertTimeout: newAlertTimeout, started: true };
          }),
        resetAlert: () =>
          set((state) => {
            if (state.alertTimeout !== null) {
              clearTimeout(state.alertTimeout);
            }

            return { alert: null, alertTimeout: null, started: false };
          }),
      }),
      {
        name: 'userStore',
      },
    ),
  ),
);

export default useAlertStore;

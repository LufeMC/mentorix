import { atom } from 'jotai';

export const alertTypes = {
  success: 'success',
  error: 'error',
  warning: 'warning',
};

export interface Alert {
  message: string;
  type: keyof typeof alertTypes;
}

export const AlertAtom = atom<Alert | null>(null);
export const AlertTimeoutAtom = atom<NodeJS.Timeout | null>(null);
export const AlertStartedAtom = atom<boolean>(false);

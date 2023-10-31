import { atom } from 'jotai';

export const LoadingAtom = atom<boolean>(true);
export const CurrentPageAtom = atom<string>('');

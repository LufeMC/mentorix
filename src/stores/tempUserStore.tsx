import { TempUser } from '../types/tempUser';
import { atom } from 'jotai';

export const TempUserAtom = atom<TempUser | null>(null);

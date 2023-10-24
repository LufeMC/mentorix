import { atom } from 'jotai';
import { User } from '../types/user';

export const UserAtom = atom<User | null>(null);

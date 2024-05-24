import { UserStateWithAuth } from '@/jotai/data/user';
import { AuthState } from '@/jotai/data/auth';
import { atom } from 'jotai';
import { User } from '@firebase/auth';

export const userAtom = atom<UserStateWithAuth>({
  authState: AuthState.loading,
  userState: null,
});

export const firebaseUserAtom = atom<User | null>(null);

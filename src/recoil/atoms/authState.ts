import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';

export enum AuthState {
  idle,
  loading,
  signingIn,
  signingOut,
  updatingProfile,
}

export const authStateAtom = atom<AuthState>({
  key: recoilKeys.authState,
  default: AuthState.loading,
});

import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';

interface AuthLoadingState {
  state: 'idle' | 'loading' | 'signingIn' | 'signingOut';
  error: string | null;
}

export const authLoadingAtom = atom<AuthLoadingState>({
  key: recoilKeys.authLoadingAtom,
  default: { state: 'loading', error: null },
});

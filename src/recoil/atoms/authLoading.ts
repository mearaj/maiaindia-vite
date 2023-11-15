import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { onAuthStateChanged } from '@firebase/auth';
import { appFirebaseAuth } from '@/firebase';

interface AuthLoadingState {
  state: 'idle' | 'loading' | 'signingIn' | 'signingOut';
  error: string | null;
}

export const authLoadingAtom = atom<AuthLoadingState>({
  key: recoilKeys.authLoadingAtom,
  default: { state: 'loading', error: null },
  effects: [
    ({ setSelf }) =>
      onAuthStateChanged(appFirebaseAuth, (_user) => {
        setSelf({ state: 'idle', error: null });
      }),
  ],
});

import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { onAuthStateChanged } from '@firebase/auth';
import { appFirebaseAuth } from '@/firebase';

export const authLoadingAtom = atom<boolean>({
  key: recoilKeys.authLoadingAtom,
  default: true,
  effects: [
    ({ setSelf }) =>
      onAuthStateChanged(appFirebaseAuth, async (_user) => {
        setSelf(false);
      }),
  ],
});

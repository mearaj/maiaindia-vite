import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { doc, getDoc } from '@firebase/firestore';
import { appFirebaseAuth, appFirestore } from '@/firebase';
import { onAuthStateChanged, User } from '@firebase/auth';

export const isAdminAtom = atom<boolean>({
  key: recoilKeys.isAdminAtom,
  default: false,
  effects: [
    ({ setSelf }) => {
      return onAuthStateChanged(appFirebaseAuth, async (user: User | null) => {
        if (user === null) {
          setSelf(false);
          return;
        }
        const docRef = doc(appFirestore, 'admins', user.uid);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists() || snapshot.id !== user.uid) {
          setSelf(false);
          return;
        }
        setSelf(true);
      });
    },
  ],
});

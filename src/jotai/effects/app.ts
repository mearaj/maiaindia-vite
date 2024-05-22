import { atomEffect } from 'jotai-effect';
import { onValue, ref, set as setDB } from '@firebase/database';
import { appFirebaseRealtime } from '@/firebase';
import { userAtom } from '@/jotai/atoms';
import { OnlineStatus } from '@/jotai/data/onlineStatus';
import { Timestamp } from '@firebase/firestore';
import { appOnlineStatusAtom } from '@/jotai/atoms/app';

export const appOnlineStatusAtomEffect = atomEffect((get, set) => {
  const connectedRef = ref(appFirebaseRealtime, '.info/connected');
  onValue(connectedRef, async (snap) => {
    const appUser = get(userAtom);
    const foundUser = appUser?.userState?.user;
    if (appUser && appUser.userState && foundUser) {
      const dbRef = ref(
        appFirebaseRealtime,
        `onlineStatuses/${foundUser.uid}/`
      );
      const online = snap.val();
      const onlineStatus: OnlineStatus = {
        online,
        updatedAt: Timestamp.now(),
      };
      set(appOnlineStatusAtom, onlineStatus);
      await setDB(dbRef, onlineStatus);
    }
  });
});

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
} from '@firebase/firestore';
import {
  appFirebaseAuth,
  appFirebaseRealtime,
  appFirebaseStorage,
  appFirestore,
  updateDocsSnapshots,
} from '@/firebase';
import { atomEffect } from 'jotai-effect';
import { OnlineStatus } from '@/jotai/data/onlineStatus';
import { onValue, ref as databaseRef, set as setDB } from '@firebase/database';
import { userAtom } from '@/jotai/atoms/user';
import {
  adminOnlineStatusesAtom,
  adminUsersAtom,
  isAdminAtom,
} from '@/jotai/atoms/admin';
import { UserProfile } from '@/jotai/data/user';
import { getDownloadURL, ref } from '@firebase/storage';
import { onAuthStateChanged, User } from '@firebase/auth';

export const isAdminAtomEffect = atomEffect((_, set) => {
  return onAuthStateChanged(appFirebaseAuth, async (user: User | null) => {
    if (user === null) {
      set(isAdminAtom, false);
      return;
    }
    const docRef = doc(appFirestore, 'admins', user.uid);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists() || snapshot.id !== user.uid) {
      set(isAdminAtom, false);
      return;
    }
    set(isAdminAtom, true);
  });
});

export const adminOnlineStatusesAtomEffect = atomEffect((get, set) => {
  const dbRef = databaseRef(appFirebaseRealtime, 'onlineStatuses/');
  return onValue(dbRef, async (snapshot) => {
    const isAdminUser = get(isAdminAtom);
    const foundUser = get(userAtom);
    if (
      !isAdminUser ||
      !foundUser ||
      !foundUser.userState ||
      !foundUser.userState.user
    ) {
      return;
    }
    const val: OnlineStatus = {
      online: true,
      updatedAt: Timestamp.now(),
    };
    let onlineStatuses = get(adminOnlineStatusesAtom);
    if (!onlineStatuses || Object.keys(onlineStatuses).length === 0) {
      onlineStatuses = {
        [foundUser.userState.user.uid]: val,
      };
    }
    if (!snapshot.exists()) {
      try {
        await setDB(dbRef, onlineStatuses);
      } catch (e) {
        console.log(e);
      }
    } else {
      set(adminOnlineStatusesAtom, { ...onlineStatuses });
    }
    console.log(onlineStatuses);
  });
});

export const adminUsersAtomEffect = atomEffect((get, set) => {
  const adminUsersQuery = collection(appFirestore, 'admins');
  return onSnapshot(adminUsersQuery, async (adminUsersSnapshot) => {
    if (adminUsersSnapshot.metadata.hasPendingWrites) {
      return;
    }
    let adminUsers: UserProfile[] = get(adminUsersAtom);
    adminUsers = updateDocsSnapshots(
      adminUsersSnapshot,
      adminUsers
    ) as UserProfile[];

    adminUsers = await Promise.all(
      adminUsers.map(async (eachProfile) => {
        const adminProfileRef = doc(appFirestore, 'users', eachProfile.id!);
        const adminProfileDoc = await getDoc(adminProfileRef);
        if (adminProfileDoc.exists() && adminProfileDoc.id === eachProfile.id) {
          const photoUrlRef = ref(
            appFirebaseStorage,
            `users/${adminProfileDoc.id}/profile`
          );
          const photoURL = await getDownloadURL(photoUrlRef);
          eachProfile = {
            ...(adminProfileDoc.data().profile as UserProfile),
            id: adminProfileDoc.id,
            photoURL,
          };
        }
        return eachProfile;
      })
    );
    set(adminUsersAtom, [...adminUsers]);
  });
});

import { collection, doc, getDoc, onSnapshot } from '@firebase/firestore';
import {
  appFirebaseAuth,
  appFirebaseStorage,
  appFirestore,
  updateDocsSnapshots,
} from '@/firebase';
import { UserProfile } from '@/jotai/data/user';
import { getDownloadURL, ref } from '@firebase/storage';
import { onAuthStateChanged, User } from '@firebase/auth';
import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';

export const adminUsersAtom = atom<UserProfile[]>([]);
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

export const isAdminAtom = atom<boolean>(false);

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

import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { collection, doc, getDoc, onSnapshot } from '@firebase/firestore';
import {
  appFirebaseAuth,
  appFirebaseStorage,
  appFirestore,
  updateDocsSnapshots,
} from '@/firebase';
import { UserProfile } from '@/recoil/data/user';
import { getDownloadURL, ref } from '@firebase/storage';
import { onAuthStateChanged, User } from '@firebase/auth';

export const adminUsersAtom = atom<UserProfile[]>({
  key: recoilKeys.adminUsersAtom,
  default: [],
  effects: [
    ({ setSelf, getPromise, node }) => {
      const adminUsersQuery = collection(appFirestore, 'admins');
      return onSnapshot(adminUsersQuery, async (adminUsersSnapshot) => {
        if (adminUsersSnapshot.metadata.hasPendingWrites) {
          return;
        }
        let adminUsers: UserProfile[] = [...(await getPromise(node))];
        adminUsers = updateDocsSnapshots(
          adminUsersSnapshot,
          adminUsers
        ) as UserProfile[];

        adminUsers = await Promise.all(
          adminUsers.map(async (eachProfile) => {
            const adminProfileRef = doc(appFirestore, 'users', eachProfile.id!);
            const adminProfileDoc = await getDoc(adminProfileRef);
            if (
              adminProfileDoc.exists() &&
              adminProfileDoc.id === eachProfile.id
            ) {
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
        setSelf([...adminUsers]);
      });
    },
  ],
});

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

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
} from '@firebase/firestore';
import {
  appFirebaseAuth,
  appFirebaseStorage,
  appFirestore,
  updateDocsSnapshots,
} from '@/firebase';
import { atomEffect } from 'jotai-effect';
import {
  allAdminsForUserAtom,
  allUsersForAdminAtom,
  isAdminAtom,
} from '@/jotai/atoms/admin';
import { BackendUser, UserProfile } from '@/jotai/data/user';
import { getDownloadURL, ref } from '@firebase/storage';
import { onAuthStateChanged, User } from '@firebase/auth';
import { userAtom } from '@/jotai/atoms';

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

export const allAdminsForUserAtomEffect = atomEffect((get, set) => {
  const adminUsersQuery = collection(appFirestore, 'admins');
  return onSnapshot(adminUsersQuery, async (adminUsersSnapshot) => {
    if (adminUsersSnapshot.metadata.hasPendingWrites) {
      return;
    }
    const adminUsersMap = get(allAdminsForUserAtom);
    let adminUsers: UserProfile[] = Object.keys(adminUsersMap).map(
      (adminID) => {
        return adminUsersMap[adminID];
      }
    );
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
    const newAdminUsersMap = adminUsers.reduce(
      (previousValue, currentValue) => {
        return {
          ...previousValue,
          [currentValue.id!]: currentValue,
        };
      },
      {}
    );
    set(allAdminsForUserAtom, newAdminUsersMap);
  });
});

export const allUsersForAdminAtomEffect = atomEffect((get, set) => {
  let user = get(userAtom);
  let isAdmin = get(isAdminAtom);
  let isValid = user.userState && isAdmin;
  if (!isValid) {
    set(allUsersForAdminAtom, {});
    return () => {};
  }
  const allUsersQuery = query(collection(appFirestore, 'users'));
  return onSnapshot(allUsersQuery, async (allUsersSnapshot) => {
    if (allUsersSnapshot.metadata.hasPendingWrites) {
      return;
    }
    user = get(userAtom);
    isAdmin = get(isAdminAtom);
    isValid = user.userState && isAdmin && !allUsersSnapshot.empty;
    if (!isValid) {
      set(allUsersForAdminAtom, {});
      return;
    }
    const prevUsersMap = get(allUsersForAdminAtom);
    const prevUsers = Object.keys(prevUsersMap).map((userID) => {
      return prevUsersMap[userID];
    });
    const currentUsers = updateDocsSnapshots(
      allUsersSnapshot,
      prevUsers
    ) as BackendUser[];
    const newCurrentUsers = currentUsers.reduce(
      (previousValue, currentValue) => {
        return {
          ...previousValue,
          [currentValue.id!]: currentValue,
        };
      },
      {}
    );
    set(allUsersForAdminAtom, newCurrentUsers);
  });
});

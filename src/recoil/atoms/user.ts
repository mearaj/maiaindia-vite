import { atom, AtomEffect } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { AppUser, UserProfile } from '@/firebase/user';
import { onAuthStateChanged, User } from '@firebase/auth';
import { appFirebaseAuth, appFirebaseStorage, appFirestore } from '@/firebase';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { collection, doc, getDoc, setDoc } from '@firebase/firestore';
import { ChatUser } from '@/config';
import { userPlaceholderUrl } from '@/firebase/firebase';

const onAuthStateChangeCallbackEffect: AtomEffect<AppUser | null> = ({
  setSelf,
}) => {
  return onAuthStateChanged(appFirebaseAuth, async (user: User | null) => {
    if (user != null) {
      let photoURL = userPlaceholderUrl;
      if (user.photoURL != null) {
        const firebaseImageRef = ref(
          appFirebaseStorage,
          `users/${user.uid}/profile`
        );
        // try to fetch the image URL, if image is not available, then we upload it to
        //  firebase storage
        let isError = false;
        try {
          photoURL = await getDownloadURL(firebaseImageRef);
        } catch (_e) {
          /* empty */
          isError = true;
        }
        if (isError) {
          try {
            const response = await fetch(user.photoURL);
            const blob = await response.blob();
            const file = new File([blob], 'profile', {
              type: blob.type,
            });
            await uploadBytes(firebaseImageRef, file);
            photoURL = await getDownloadURL(firebaseImageRef);
          } catch (e) {
            /* empty */
          }
        }
      }
      let displayName = 'No Name';
      if (user.displayName !== null) {
        displayName = user.displayName;
      }
      const profile = { displayName, photoURL };
      const docRef = doc(appFirestore, 'users', user.uid);
      try {
        const docSnapshot = await getDoc(docRef);
        if (!docSnapshot.exists()) {
          const usersRef = collection(appFirestore, 'users');
          await setDoc(doc(usersRef, user.uid), { profile }, { merge: true });
        } else {
          const obtainedProfile = docSnapshot.data().profile as UserProfile;
          if (obtainedProfile.displayName != null) {
            profile.displayName = obtainedProfile.displayName;
          }
          if (obtainedProfile.photoURL != null) {
            profile.photoURL = obtainedProfile.photoURL;
          }
        }
      } catch (e) {
        /* empty */
      }
      setSelf({
        user,
        profile,
      });
    } else {
      setSelf(null);
    }
  });
};
export const userAtom = atom<AppUser | null>({
  key: recoilKeys.userAtom,
  dangerouslyAllowMutability: true,
  default: null,
  effects: [onAuthStateChangeCallbackEffect],
});

export const selectedChatUserAtom = atom<ChatUser | null>({
  key: recoilKeys.selectedChatUser,
  default: null,
});

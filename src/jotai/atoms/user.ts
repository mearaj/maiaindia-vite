import { onAuthStateChanged, User } from '@firebase/auth';
import { appFirebaseAuth, appFirebaseStorage, appFirestore } from '@/firebase';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { doc, onSnapshot, serverTimestamp, setDoc } from '@firebase/firestore';
import { AppUser, UserProfile } from '@/jotai/data/user';
import { AuthState } from '@/jotai/data/auth';
import { Cart } from '@/jotai/data/cart';
import { atomEffect } from 'jotai-effect';
import { atom } from 'jotai';

export const userAtom = atom<AppUser>({
  authState: AuthState.loading,
  userState: null,
});

export const userAtomEffect = atomEffect((_, set) => {
  let userSubscription = () => {};
  const authSubscription = onAuthStateChanged(
    appFirebaseAuth,
    async (user: User | null) => {
      if (user === null) {
        set(userAtom, { authState: AuthState.idle, userState: null });
        return;
      }
      const docRef = doc(appFirestore, 'users', user.uid);
      userSubscription = onSnapshot(docRef, async (userQuerySnapshot) => {
        if (userQuerySnapshot.metadata.hasPendingWrites) {
          return;
        }
        // const docSnapshot = await getDoc(docRef);
        const firebaseImageRef = ref(
          appFirebaseStorage,
          `users/${user.uid}/profile`
        );
        let photoURL: string | null = null;
        try {
          photoURL = await getDownloadURL(firebaseImageRef);
        } catch (e) {
          console.log(e);
        }
        if (!userQuerySnapshot.exists()) {
          const { displayName } = user;
          const { email } = user;
          if (!photoURL && user.photoURL) {
            try {
              const response = await fetch(user.photoURL);
              const blob = await response.blob();
              const file = new File([blob], 'profile', {
                type: blob.type,
              });
              await uploadBytes(firebaseImageRef, file);
              photoURL = await getDownloadURL(firebaseImageRef);
            } catch (e) {
              console.log(e);
            }
          }
          const profileToSet = {
            displayName,
            email,
          };
          const cartToSet: Cart = {
            items: {},
            updatedAt: serverTimestamp(),
          };
          await setDoc(docRef, {
            profile: profileToSet,
            cart: cartToSet,
          });
          set(userAtom, {
            authState: AuthState.idle,
            userState: {
              user,
              cart: cartToSet,
              profile: {
                ...profileToSet,
                photoURL,
                id: user.uid,
              },
            },
          });
        } else {
          set(userAtom, {
            authState: AuthState.idle,
            userState: {
              user,
              cart: userQuerySnapshot.data().cart as Cart,
              profile: {
                ...(userQuerySnapshot.data().profile as UserProfile),
                photoURL,
                id: user.uid,
              },
            },
          });
        }
      });
    }
  );
  return () => {
    authSubscription();
    userSubscription();
  };
});

import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { onAuthStateChanged, User } from '@firebase/auth';
import { appFirebaseAuth, appFirebaseStorage, appFirestore } from '@/firebase';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { doc, onSnapshot, serverTimestamp, setDoc } from '@firebase/firestore';
import { AppUser, UserProfile } from '@/recoil/data/user';
import { AuthState } from '@/recoil/data/auth';
import { Cart } from '@/recoil/data/cart';

export const userAtom = atom<AppUser>({
  key: recoilKeys.userAtom,
  dangerouslyAllowMutability: true,
  default: { authState: AuthState.loading, userState: null },
  effects: [
    ({ setSelf }) => {
      let userSubscription = () => {};
      const authSubscription = onAuthStateChanged(
        appFirebaseAuth,
        async (user: User | null) => {
          if (user === null) {
            setSelf({ authState: AuthState.idle, userState: null });
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
              setSelf({
                authState: AuthState.idle,
                userState: {
                  user,
                  cart: cartToSet,
                  profile: {
                    ...profileToSet,
                    photoURL,
                    uid: user.uid,
                  },
                },
              });
            } else {
              setSelf({
                authState: AuthState.idle,
                userState: {
                  user,
                  cart: userQuerySnapshot.data().cart as Cart,
                  profile: {
                    ...(userQuerySnapshot.data().profile as UserProfile),
                    photoURL,
                    uid: user.uid,
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
    },
  ],
});

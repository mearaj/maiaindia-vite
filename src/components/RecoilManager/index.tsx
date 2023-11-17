import { PropsWithChildren, useCallback, useEffect } from 'react';
import { appFirebaseAuth, appFirebaseStorage, appFirestore } from '@/firebase';
import { UserProfile } from '@/firebase/user';
import { onAuthStateChanged, User } from '@firebase/auth';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from '@firebase/firestore';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { AuthState, authStateAtom } from '@/recoil/atoms/authState';
import { cartAtom } from '@/recoil/atoms/cart';
import { Cart, defaultPlaceholderCart } from '@/firebase/cart';

const userPlaceholderUrl = `https://firebasestorage.googleapis.com/v0/b/maiaindia.appspot.com/o/images%2Fuser-placeholder.svg?alt=media`;
export default function RecoilManager({ children }: PropsWithChildren) {
  const setUser = useSetRecoilState(userAtom);
  const setAuthState = useSetRecoilState(authStateAtom);
  const [cart, setCart] = useRecoilState(cartAtom);

  const updateCartOnAuthChange = useCallback(
    async (user: User | null) => {
      if (user === null) {
        setCart(defaultPlaceholderCart);
        return;
      }
      let apiCart: Cart = defaultPlaceholderCart;
      const userDocRef = doc(appFirestore, 'users', user.uid);
      const cartSnapShot = await getDoc(userDocRef);
      if (cartSnapShot.exists()) {
        apiCart = cartSnapShot.data().cart ?? defaultPlaceholderCart;
      }
      setCart(apiCart);
    },
    [setCart]
  );

  const updateUserOnAuthChange = useCallback(
    async (user: User | null) => {
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
            await setDoc(
              doc(usersRef, user.uid),
              { profile },
              { mergeFields: ['profile'] }
            );
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
        setUser({
          user,
          profile,
        });
      } else {
        setUser(null);
      }
      setAuthState(AuthState.idle);
    },
    [setAuthState, setUser]
  );

  const listenToUserOnAuthChanges = useCallback(
    (user: User | null) => {
      if (user === null) {
        return () => {};
      }
      const docRef = doc(appFirestore, 'users', user.uid);
      return onSnapshot(docRef, async (userQuerySnapshot) => {
        if (!userQuerySnapshot.exists()) {
          return;
        }
        const apiCart = userQuerySnapshot.data().cart ?? defaultPlaceholderCart;
        if (
          apiCart.updatedAt > cart.updatedAt &&
          apiCart.updatedAt !== cart.updatedAt
        ) {
          setCart({ ...apiCart });
          console.log('setting cart');
        }
      });
    },
    [cart.updatedAt, setCart]
  );

  useEffect(() => {
    let cartSubscription = () => {};
    const subscription = onAuthStateChanged(
      appFirebaseAuth,
      async (authUser) => {
        await updateUserOnAuthChange(authUser);
        await updateCartOnAuthChange(authUser);
        cartSubscription();
        cartSubscription = listenToUserOnAuthChanges(authUser);
      }
    );
    return () => {
      subscription();
      cartSubscription();
    };
  }, [
    listenToUserOnAuthChanges,
    updateCartOnAuthChange,
    updateUserOnAuthChange,
  ]);
  return children;
}

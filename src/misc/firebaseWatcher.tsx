import { PropsWithChildren, useCallback, useEffect } from 'react';
import { onAuthStateChanged, User } from '@firebase/auth';
import { appFirebaseAuth, appFirebaseStorage, appFirestore } from '@/firebase';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { authLoadingAtom } from '@/recoil/atoms/authLoading';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { cartAtom } from '@/recoil/atoms/cart';
import { defaultPlaceholderCart } from '@/firebase/cart';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
} from '@firebase/firestore';
import { productsSelector } from '@/recoil';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { UserProfile } from '@/firebase/user';

const userPlaceholderUrl = `https://firebasestorage.googleapis.com/v0/b/maiaindia.appspot.com/o/images%2Fuser-placeholder.svg?alt=media`;

export default function FirebaseWatcher({ children }: PropsWithChildren) {
  const setIsLoadingAuth = useSetRecoilState(authLoadingAtom);
  const setCartAtom = useSetRecoilState(cartAtom);
  const [, setUser] = useRecoilState(userAtom);
  const productsReload = useRecoilRefresher_UNSTABLE(productsSelector);

  const retrieveCart = useCallback(
    (user: User | null) => {
      if (user) {
        const cartItemValue = localStorage.getItem(
          user.uid + recoilKeys.cartAtom
        );
        if (cartItemValue !== null) {
          const parsedCartValue = JSON.parse(cartItemValue);
          if (parsedCartValue) {
            setCartAtom(parsedCartValue);
          } else {
            setCartAtom(defaultPlaceholderCart);
          }
        }
      } else {
        setCartAtom(defaultPlaceholderCart);
      }
    },
    [setCartAtom]
  );

  const updateProfileOnAuthChange = useCallback(
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
            await setDoc(doc(usersRef, user.uid), profile);
          } else {
            const obtainedProfile = docSnapshot.data() as UserProfile;
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
    },
    [setUser]
  );

  useEffect(() => {
    return onAuthStateChanged(appFirebaseAuth, async (user) => {
      await updateProfileOnAuthChange(user);
      retrieveCart(user);
      setIsLoadingAuth(false);
    });
  }, [
    updateProfileOnAuthChange,
    retrieveCart,
    setCartAtom,
    setIsLoadingAuth,
    setUser,
  ]);

  // Whenever the product is updated in the backend, this function
  // clear caches and forces re-evaluation (by re-fetching products)
  // https://recoiljs.org/docs/guides/asynchronous-data-queries
  // https://firebase.google.com/docs/firestore/query-data/listen
  useEffect(() => {
    const productsRef = collection(appFirestore, 'products');
    const productsQuery = query(productsRef);
    return onSnapshot(productsQuery, (_querySnapshot) => {
      productsReload();
    });
  }, [productsReload]);

  return children;
}

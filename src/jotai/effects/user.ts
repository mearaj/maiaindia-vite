import { appFirebaseAuth, appFirebaseStorage, appFirestore } from '@/firebase';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { doc, onSnapshot, serverTimestamp, setDoc } from '@firebase/firestore';
import { UserProfile } from '@/jotai/data/user';
import { AuthState } from '@/jotai/data/auth';
import { Cart } from '@/jotai/data/cart';
import { atomEffect } from 'jotai-effect';
import { userAtom } from '@/jotai/atoms';
import { firebaseUserAtom } from '@/jotai/atoms/user';
import { onAuthStateChanged } from '@firebase/auth';

export const userAtomEffect = atomEffect((get, set) => {
  const user = get(firebaseUserAtom);
  if (!user) {
    set(userAtom, { authState: AuthState.idle, userState: null });
    return () => {};
  }
  const docRef = doc(appFirestore, 'users', user.uid);
  return onSnapshot(docRef, async (userQuerySnapshot) => {
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
    let profileToSet: UserProfile;
    let cartToSet: Cart;
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
      profileToSet = { displayName, email, photoURL, id: user.uid };
      cartToSet = { items: {}, updatedAt: serverTimestamp() } as Cart;
      await setDoc(docRef, { profile: profileToSet, cart: cartToSet });
    } else {
      cartToSet = userQuerySnapshot.data().cart as Cart;
      profileToSet = {
        ...(userQuerySnapshot.data().profile as UserProfile),
        photoURL,
        id: user.uid,
      };
    }
    set(userAtom, {
      authState: AuthState.idle,
      userState: {
        user,
        cart: cartToSet,
        profile: profileToSet,
        updatedAt: serverTimestamp(),
      },
    });
  });
});

export const onAuthStateChangedEffect = atomEffect((_, set) => {
  return onAuthStateChanged(appFirebaseAuth, (user) => {
    set(firebaseUserAtom, user);
  });
});

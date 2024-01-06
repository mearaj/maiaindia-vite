import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { Cart, defaultPlaceholderCart } from '@/recoil/data/cart';
import { doc, onSnapshot, setDoc } from '@firebase/firestore';
import { appFirebaseAuth, appFirestore } from '@/firebase';
import { onAuthStateChanged, User } from '@firebase/auth';

export const cartAtom = atom<Cart>({
  key: recoilKeys.cartAtom,
  default: defaultPlaceholderCart,
  effects: [
    ({ setSelf }) => {
      let cartSubscription = () => {};
      const authSubscription = onAuthStateChanged(
        appFirebaseAuth,
        async (user: User | null) => {
          if (user === null) {
            setSelf(defaultPlaceholderCart);
            return;
          }
          const docRef = doc(appFirestore, 'users', user.uid);
          cartSubscription = onSnapshot(docRef, async (userQuerySnapShot) => {
            if (!userQuerySnapShot.exists()) {
              setSelf(defaultPlaceholderCart);
              return;
            }
            const apiCart =
              userQuerySnapShot.data().cart ?? defaultPlaceholderCart;
            setSelf(apiCart);
          });
        }
      );
      return () => {
        cartSubscription();
        authSubscription();
        setSelf(defaultPlaceholderCart);
      };
    },
    ({ onSet, setSelf }) => {
      onSet(async (localCart) => {
        const user = appFirebaseAuth.currentUser;
        if (!user) {
          setSelf(defaultPlaceholderCart);
          return;
        }
        const userDocRef = doc(appFirestore, 'users', user.uid);
        await setDoc(
          userDocRef,
          { cart: localCart },
          { mergeFields: ['cart'] }
        );
      });
    },
  ],
});

import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { Cart, defaultPlaceholderCart } from '@/firebase/cart';
import { userAtom } from '@/recoil/atoms/user';
import { doc, setDoc } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import * as localforage from 'localforage';

export const cartAtom = atom<Cart>({
  key: recoilKeys.cartAtom,
  default: defaultPlaceholderCart,
  effects: [
    ({ onSet, getPromise, setSelf }) => {
      onSet(async (localCart) => {
        const user = await getPromise(userAtom);
        if (!user) {
          setSelf(defaultPlaceholderCart);
          return;
        }
        const userDocRef = doc(appFirestore, 'users', user.user.uid);
        try {
          const cartString = JSON.stringify(localCart as Cart);
          await localforage.setItem(
            user.user.uid + recoilKeys.cartAtom,
            cartString
          );
          await setDoc(
            userDocRef,
            { cart: localCart },
            { mergeFields: ['cart'] }
          );
        } catch (e) {
          /* empty */
        }
      });
    },
  ],
});

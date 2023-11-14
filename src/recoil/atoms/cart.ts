import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { Cart, defaultPlaceholderCart } from '@/firebase/cart';
import { userAtom } from '@/recoil/atoms/user';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import * as localforage from 'localforage';
import { mergeCartItems } from '@/misc';

export const cartAtom = atom<Cart>({
  key: recoilKeys.cartAtom,
  default: defaultPlaceholderCart,
  effects: [
    ({ onSet, getPromise, setSelf, trigger }) => {
      const loadCart = async () => {
        const user = await getPromise(userAtom);
        if (user) {
          let apiCart: Cart = defaultPlaceholderCart;
          let localCart: Cart = defaultPlaceholderCart;
          const localCartString = await localforage.getItem(
            user.user.uid + recoilKeys.cartAtom
          );
          if (typeof localCartString === 'string') {
            localCart = JSON.parse(localCartString);
          }
          const cartRef = doc(appFirestore, 'carts', user.user.uid);
          const cartSnapShot = await getDoc(cartRef);
          if (cartSnapShot.exists()) {
            apiCart = cartSnapShot.data() as Cart;
          }
          // Todo: Check if interfaces matches in case Cart interface is changed
          if (!('items' in localCart)) {
            localCart = defaultPlaceholderCart;
          }
          const mergedCart = mergeCartItems(apiCart, localCart);
          setSelf(mergedCart);
        } else {
          setSelf(defaultPlaceholderCart);
        }
      };
      if (trigger === 'get') {
        loadCart();
      }

      onSet(async (cart) => {
        const user = await getPromise(userAtom);
        if (user) {
          const cartString = JSON.stringify(cart);
          const cartRef = doc(appFirestore, 'carts', user.user.uid);
          await setDoc(cartRef, cart);
          await localforage.setItem(
            user.user.uid + recoilKeys.cartAtom,
            cartString
          );
        } else {
          setSelf(defaultPlaceholderCart);
        }
      });
    },
  ],
});

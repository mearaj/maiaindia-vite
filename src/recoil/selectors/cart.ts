import { selector } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { Cart, defaultPlaceholderCart } from '@/firebase/cart';
import { userAtom } from '@/recoil/atoms/user';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import * as localforage from 'localforage';
import { mergeCartItems } from '@/misc';

export const cartSelector = selector<Cart>({
  key: recoilKeys.cartSelector,
  get: async ({ get }) => {
    const user = get(userAtom);
    if (!user) {
      return defaultPlaceholderCart;
    }
    let apiCart: Cart = defaultPlaceholderCart;
    let localCart: Cart = defaultPlaceholderCart;
    const localCartString = await localforage.getItem(
      user.user.uid + recoilKeys.cartSelector
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
    return mergeCartItems(apiCart, localCart);
  },
  set: async ({ get }, cart) => {
    const user = get(userAtom);
    if (user) {
      const cartString = JSON.stringify(cart);
      const cartRef = doc(appFirestore, 'carts', user.user.uid);
      await setDoc(cartRef, cart);
      await localforage.setItem(
        user.user.uid + recoilKeys.cartSelector,
        cartString
      );
    }
  },
});

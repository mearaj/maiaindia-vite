import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { Cart, defaultPlaceholderCart } from '@/firebase/cart';
import { userAtom } from '@/recoil/atoms/user';

export const cartAtom = atom<Cart>({
  key: recoilKeys.cartAtom,
  default: defaultPlaceholderCart,
  effects: [
    ({ onSet, getPromise }) => {
      onSet(async (cart) => {
        const user = await getPromise(userAtom);
        if (user) {
          const cartString = JSON.stringify(cart);
          localStorage.setItem(user.user.uid + recoilKeys.cartAtom, cartString);
        }
      });
    },
  ],
});

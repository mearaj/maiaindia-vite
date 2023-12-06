import { DefaultValue, selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { cartAtom } from '@/recoil/atoms/cart';
import { userAtom } from '@/recoil/atoms';

export const cartQuantityByProductIDSelector = selectorFamily<number, string>({
  key: recoilKeys.cartQuantityByProductIDSelector,
  get:
    (productID: string) =>
    ({ get }) => {
      const cart = get(cartAtom);
      const user = get(userAtom);
      const cartItems = cart.items;
      return !cartItems[productID] || cartItems[productID].quantity < 1 || !user
        ? 0
        : cartItems[productID].quantity;
    },
  set:
    (productID) =>
    ({ get, set }, quantity) => {
      const cart = get(cartAtom);
      let { items } = cart;
      if (quantity instanceof DefaultValue) {
        return;
      }
      if (quantity < 1) {
        const newCartItems = { ...items };
        delete newCartItems[productID];
        items = newCartItems;
      } else {
        items = {
          ...items,
          [productID]: {
            quantity,
          },
        };
      }
      set(cartAtom, { items, updatedAt: Date.now() });
    },
});

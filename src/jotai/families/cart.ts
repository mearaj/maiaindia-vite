import { atomFamily } from 'jotai/utils';
import { atom } from 'jotai/index';
import { userAtom } from '@/jotai/atoms';
import { doc, serverTimestamp, setDoc } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { BackendUser } from '@/jotai/data/user';

export const cartQuantityAtomFamily = atomFamily((compoundID: string) =>
  atom(
    (get) => {
      const user = get(userAtom);
      if (!user.userState) {
        return 0;
      }
      const cartItems = user.userState.cart?.items ?? {};
      // const compoundID = `${productID}-${variantID}`;
      return !cartItems[compoundID] || cartItems[compoundID]?.quantity < 1
        ? 0
        : cartItems[compoundID].quantity;
    },
    async (get, _, quantity: number) => {
      const user = get(userAtom);
      if (!user.userState) {
        return;
      }
      let { items } = user.userState.cart;
      // const compoundID = `${productID}-${variantID}`;
      if (quantity < 1) {
        const newCartItems = { ...items };
        delete newCartItems[compoundID];
        items = newCartItems;
      } else {
        items = {
          ...items,
          [compoundID]: {
            quantity,
            createdAt: items[compoundID]?.createdAt ?? serverTimestamp(),
          },
        };
      }
      const docRef = doc(appFirestore, 'users', user.userState.user.uid);
      await setDoc(
        docRef,
        {
          cart: { items },
          updatedAt: serverTimestamp(),
        } as BackendUser,
        { mergeFields: ['cart.items', 'updatedAt'] }
      );
    }
  )
);

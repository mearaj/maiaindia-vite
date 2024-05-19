import { AppUser } from '@/jotai/data/user';
import { doc, serverTimestamp, setDoc } from '@firebase/firestore';
import { appFirestore } from '@/firebase';

export const getCartQuantity = (
  user: AppUser,
  productID: string,
  variantID: string
) => {
  if (!user.userState) {
    return 0;
  }
  const cartItems = user.userState.cart.items;
  const compoundID = `${productID}-${variantID}`;
  return !cartItems[compoundID] || cartItems[compoundID].quantity < 1 || !user
    ? 0
    : cartItems[compoundID].quantity;
};

export const setCartQuantity = async (
  user: AppUser,
  productID: string,
  variantID: string,
  quantity: number
) => {
  if (!user.userState) {
    return;
  }
  let { items } = user.userState.cart;
  const compoundID = `${productID}-${variantID}`;
  if (quantity < 1) {
    const newCartItems = { ...items };
    delete newCartItems[compoundID];
    items = newCartItems;
  } else {
    items = {
      ...items,
      [compoundID]: {
        quantity,
      },
    };
  }
  const docRef = doc(appFirestore, 'users', user.userState.user.uid);
  await setDoc(docRef, {
    profile: {
      displayName: user.userState.profile.displayName,
      email: user.userState.profile.email,
    },
    cart: {
      items,
      updatedAt: serverTimestamp(),
    },
  });
};

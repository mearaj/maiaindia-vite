import { Location } from 'react-router-dom';
import { AppUser } from '@/jotai/data/user';
import { doc, serverTimestamp, setDoc } from '@firebase/firestore';
import { appFirestore } from '@/firebase';

export const isActiveByEqual = (currentPaths: string[], location: Location) => {
  for (let i = 0; i < currentPaths.length; i += 1) {
    if (location.pathname === currentPaths[i]) {
      return true;
    }
  }
  return false;
};

export const isActiveByStartsWith = (
  currentPaths: string[],
  location: Location
) => {
  for (let i = 0; i < currentPaths.length; i += 1) {
    if (location.pathname.startsWith(currentPaths[i])) {
      return true;
    }
  }
  return false;
};

export const getCartQuantity = (user: AppUser, productID: string) => {
  if (!user.userState) {
    return 0;
  }
  const cartItems = user.userState.cart.items;
  return !cartItems[productID] || cartItems[productID].quantity < 1 || !user
    ? 0
    : cartItems[productID].quantity;
};

export const setCartQuantity = async (
  user: AppUser,
  productID: string,
  quantity: number
) => {
  if (!user.userState) {
    return;
  }
  let { items } = user.userState.cart;
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

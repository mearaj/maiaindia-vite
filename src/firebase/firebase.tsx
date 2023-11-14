import { PropsWithChildren, useEffect } from 'react';
import { onAuthStateChanged } from '@firebase/auth';
import { appFirebaseAuth, appFirestore } from '@/firebase/index';
import { useRecoilRefresher_UNSTABLE, useSetRecoilState } from 'recoil';
import { cartSelector } from '@/recoil/selectors/cart';
import { collection, onSnapshot, query } from '@firebase/firestore';
import { productsSelector } from '@/recoil';

export const userPlaceholderUrl = `https://firebasestorage.googleapis.com/v0/b/maiaindia.appspot.com/o/images%2Fuser-placeholder.svg?alt=media`;

export default function FirebaseSideEffects({ children }: PropsWithChildren) {
  const setCartAtom = useSetRecoilState(cartSelector);
  const productsReload = useRecoilRefresher_UNSTABLE(productsSelector);
  const cartReload = useRecoilRefresher_UNSTABLE(cartSelector);

  useEffect(() => {
    return onAuthStateChanged(appFirebaseAuth, async (_user) => {
      cartReload();
    });
  }, [setCartAtom, cartReload]);

  // Whenever the product is updated in the backend, this function
  // clear caches and forces re-evaluation (by re-fetching products)
  // https://recoiljs.org/docs/guides/asynchronous-data-queries
  // https://firebase.google.com/docs/firestore/query-data/listen
  useEffect(() => {
    const productsRef = collection(appFirestore, 'products');
    const productsQuery = query(productsRef);
    return onSnapshot(productsQuery, (_querySnapshot) => {
      productsReload();
    });
  }, [productsReload]);

  return children;
}

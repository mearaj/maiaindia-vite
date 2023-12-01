import { useEffect } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { appFirestore } from '@/firebase';
import { doc, getDoc } from '@firebase/firestore';
import { userAtom } from '@/recoil/atoms';
import { defaultPlaceholderCart } from '@/recoil/data/cart';
import { cartAtom } from '@/recoil/atoms/cart';

export default function CartAuthStateSideEffects() {
  const appUser = useRecoilValue(userAtom);

  const updateCartOnAuthStateChange = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const currentUser = await snapshot.getPromise(userAtom);
        if (!currentUser.userState) {
          set(cartAtom, defaultPlaceholderCart);
          return;
        }
        const docRef = doc(
          appFirestore,
          'users',
          currentUser.userState.user.uid
        );
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const apiCart = docSnapshot.data().cart ?? defaultPlaceholderCart;
          set(cartAtom, apiCart);
        }
      },
    []
  );

  useEffect(() => {
    updateCartOnAuthStateChange();
  }, [appUser.userState, updateCartOnAuthStateChange]);

  return null;
}

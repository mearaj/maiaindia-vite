import { useAtom, useAtomValue, useSetAtom } from 'jotai/index';
import { userAtom } from '@/jotai/atoms';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { useEffect, useState } from 'react';
import { showCartAtom } from '@/jotai/atoms/cart';
import { cartQuantityAtomFamily } from '@/jotai/families/cart';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';

export function useAddUpdateCartEffect({ compoundID }: { compoundID: string }) {
  const user = useAtomValue(userAtom);
  const setActiveDialog = useSetAtom(selectedDialogAtom);
  const [quantity, setCartQuantity] = useAtom(
    cartQuantityAtomFamily(compoundID)
  );
  const [loading, setIsLoading] = useState(true);
  const [, setShowCart] = useAtom(showCartAtom);

  const handleCartIncrement = async () => {
    if (!user.userState) {
      setActiveDialog(<SignInRequiredDialog />);
      return;
    }
    setIsLoading(true);
    const cartItems = user.userState.cart.items;
    const quantityAlt = cartItems[compoundID]
      ? cartItems[compoundID].quantity + 1
      : 1;
    setCartQuantity(quantityAlt);
    setShowCart(true);
  };

  const onDecrementClicked = async () => {
    if (!user.userState) {
      return;
    }
    setIsLoading(true);
    const cartItems = user.userState.cart.items;
    const quantityAlt = cartItems[compoundID]
      ? cartItems[compoundID].quantity - 1
      : 0;
    setCartQuantity(quantityAlt);
    setShowCart(true);
  };

  useEffect(() => {
    setIsLoading(false);
  }, [compoundID, user.userState?.cart.items]);

  return {
    handleCartIncrement,
    onDecrementClicked,
    quantity,
    loading,
  };
}

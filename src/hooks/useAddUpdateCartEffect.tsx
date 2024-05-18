import { Product } from '@/jotai/data/product';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/index';
import { userAtom } from '@/jotai/atoms';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { useEffect, useState } from 'react';
import { cartAtom } from '@/jotai/atoms/cart';
import { setCartQuantity } from '@/misc';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';

export function useAddUpdateCartEffect({ product }: { product: Product }) {
  const user = useAtomValue(userAtom);
  const setActiveDialog = useSetAtom(selectedDialogAtom);
  const [quantity, setQuantity] = useState(
    user.userState?.cart.items[product.id!]?.quantity ?? 0
  );
  const [loading, setIsLoading] = useState(true);
  const [, setShowCart] = useAtom(cartAtom);

  const handleCartIncrement = async () => {
    if (!user.userState) {
      setActiveDialog(<SignInRequiredDialog />);
      return;
    }
    setIsLoading(true);
    const cartItems = user.userState.cart.items;
    const quantityAlt = cartItems[product.id!]
      ? cartItems[product.id!].quantity + 1
      : 1;
    setCartQuantity(user, product.id!, quantityAlt);
    setShowCart(true);
  };

  const onDecrementClicked = async () => {
    if (!user.userState) {
      return;
    }
    setIsLoading(true);
    const cartItems = user.userState.cart.items;
    const quantityAlt = cartItems[product.id!]
      ? cartItems[product.id!].quantity - 1
      : 0;
    setCartQuantity(user, product.id!, quantityAlt);
    setShowCart(true);
  };

  useEffect(() => {
    setQuantity(user.userState?.cart.items[product.id!]?.quantity ?? 0);
    setIsLoading(false);
  }, [product.id, user.userState?.cart.items]);

  return {
    handleCartIncrement,
    onDecrementClicked,
    quantity,
    loading,
  };
}

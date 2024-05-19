import { CompoundProduct } from '@/jotai/data/product';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/index';
import { userAtom } from '@/jotai/atoms';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { useEffect, useState } from 'react';
import { showCartAtom } from '@/jotai/atoms/cart';
import { getCartQuantity, setCartQuantity } from '@/misc/cart';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';

export function useAddUpdateCartEffect({
  compoundProduct: { product, variant },
}: {
  compoundProduct: CompoundProduct;
}) {
  const user = useAtomValue(userAtom);
  const compoundID = `${product.id}-${variant.id}`;
  const setActiveDialog = useSetAtom(selectedDialogAtom);
  const [quantity, setQuantity] = useState(
    getCartQuantity(user, product.id!, variant.id)
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
    setCartQuantity(user, product.id!, variant.id!, quantityAlt);
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
    setCartQuantity(user, product.id!, variant.id, quantityAlt);
    setShowCart(true);
  };

  useEffect(() => {
    setQuantity(user.userState?.cart.items[compoundID]?.quantity ?? 0);
    setIsLoading(false);
  }, [compoundID, user.userState?.cart.items]);

  return {
    handleCartIncrement,
    onDecrementClicked,
    quantity,
    loading,
  };
}

import { Box, Button } from '@mui/material';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import AddToCartIcon from '@mui/icons-material/AddShoppingCart';
import React from 'react';
import { userAtom } from '@/recoil/atoms';
import { Product } from '@/recoil/data/product';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { Add, Remove } from '@mui/icons-material';
import { getCartQuantity, setCartQuantity } from '@/misc';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';

interface AddUpdateButtonProps {
  product: Product;
}

export default function AddUpdateButton({ product }: AddUpdateButtonProps) {
  const user = useRecoilValue(userAtom);
  const setActiveDialog = useSetRecoilState(selectedDialogAtom);
  const quantity = getCartQuantity(user, product.id!);

  const handleCartIncrement = async (
    _e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!user.userState) {
      setActiveDialog(<SignInRequiredDialog />);
      return;
    }
    const cartItems = user.userState.cart.items;
    const quantityAlt = cartItems[product.id!]
      ? cartItems[product.id!].quantity + 1
      : 1;
    await setCartQuantity(user, product.id!, quantityAlt);
  };

  const onDecrementClicked = async (
    _e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!user.userState) {
      return;
    }
    const cartItems = user.userState.cart.items;
    const quantityAlt = cartItems[product.id!]
      ? cartItems[product.id!].quantity - 1
      : 0;
    await setCartQuantity(user, product.id!, quantityAlt);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '44px',
        padding: '6px 0',
      }}
    >
      <Button
        variant="text"
        fullWidth
        onClick={handleCartIncrement}
        sx={{ display: quantity < 1 ? 'flex' : 'none' }}
      >
        <AddToCartIcon
          sx={{
            height: '32px',
            width: 'auto',
            marginRight: '4px',
          }}
        />
        <Box sx={{ fontSize: '16px' }}>Add</Box>
      </Button>
      <Button
        sx={{
          display: quantity > 0 ? 'flex' : 'none',
          minWidth: 0,
          padding: '4px',
        }}
        onClick={onDecrementClicked}
        variant="outlined"
      >
        <Remove />
      </Button>
      <Box
        sx={{
          display: quantity > 0 ? 'flex' : 'none',
          minWidth: 0,
          padding: '4px',
          lineHeight: 1,
          fontSize: '22px',
        }}
      >
        {quantity}
      </Box>
      <Button
        sx={{
          display: quantity > 0 ? 'flex' : 'none',
          minWidth: 0,
          padding: '4px',
        }}
        onClick={handleCartIncrement}
        variant="outlined"
      >
        <Add />
      </Button>
    </Box>
  );
}

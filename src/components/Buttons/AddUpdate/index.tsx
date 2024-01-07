import { Box, Button } from '@mui/material';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import AddToCartIcon from '@mui/icons-material/AddShoppingCart';
import React, { useEffect, useState } from 'react';
import { userAtom } from '@/recoil/atoms';
import { Product } from '@/recoil/data/product';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { Add, Remove } from '@mui/icons-material';
import { setCartQuantity } from '@/misc';
import CircularProgress from '@mui/material/CircularProgress';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';

interface AddUpdateButtonProps {
  product: Product;
}

export default function AddUpdateButton({ product }: AddUpdateButtonProps) {
  const user = useRecoilValue(userAtom);
  const setActiveDialog = useSetRecoilState(selectedDialogAtom);
  const [quantity, setQuantity] = useState(0);
  const [loading, setIsLoading] = useState(true);

  const handleCartIncrement = async (
    _e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
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
  };

  const onDecrementClicked = async (
    _e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!user.userState) {
      return;
    }
    setIsLoading(true);
    const cartItems = user.userState.cart.items;
    const quantityAlt = cartItems[product.id!]
      ? cartItems[product.id!].quantity - 1
      : 0;
    setCartQuantity(user, product.id!, quantityAlt);
  };

  useEffect(() => {
    setQuantity(user.userState?.cart.items[product.id!]?.quantity ?? 0);
    setIsLoading(false);
  }, [product.id, user.userState?.cart.items]);

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
        disabled={loading}
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
        disabled={loading}
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
        {loading ? <CircularProgress size="22px" /> : quantity}
      </Box>
      <Button
        sx={{
          display: quantity > 0 ? 'flex' : 'none',
          minWidth: 0,
          padding: '4px',
        }}
        disabled={loading}
        onClick={handleCartIncrement}
        variant="outlined"
      >
        <Add />
      </Button>
    </Box>
  );
}

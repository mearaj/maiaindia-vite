import { Box, Button } from '@mui/material';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { cartAtom } from '@/recoil/atoms/cart';
import AddToCartIcon from '@mui/icons-material/AddShoppingCart';
import React from 'react';
import { userAtom } from '@/recoil/atoms';
import { Product } from '@/recoil/data/product';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { Add, Remove } from '@mui/icons-material';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';

interface AddUpdateButtonProps {
  product: Product;
}

export default function AddUpdateButton({ product }: AddUpdateButtonProps) {
  const [cart, setCart] = useRecoilState(cartAtom);
  const user = useRecoilValue(userAtom);
  const setActiveDialog = useSetRecoilState(selectedDialogAtom);

  const updateQuantity = (quantity: number) => {
    let { items } = cart;
    if (quantity < 1) {
      const newCartItems = { ...items };
      delete newCartItems[product.id];
      items = newCartItems;
    } else {
      items = {
        ...items,
        [product.id]: {
          quantity,
        },
      };
    }
    setCart({ items, updatedAt: Date.now() });
  };
  const handleCartIncrement = (
    _e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!user.userState) {
      setActiveDialog(<SignInRequiredDialog />);
      return;
    }
    const cartItems = cart.items;
    const quantity = cartItems[product.id]
      ? cartItems[product.id].quantity + 1
      : 1;
    updateQuantity(quantity);
  };

  const onDecrementClicked = (
    _e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const cartItems = cart.items;
    const quantity = cartItems[product.id]
      ? cartItems[product.id].quantity - 1
      : 0;
    updateQuantity(quantity);
  };

  const cartItems = cart.items;
  const quantity =
    !cartItems[product.id] || cartItems[product.id].quantity < 1 || !user
      ? 0
      : cartItems[product.id].quantity;
  if (!quantity) {
    return (
      <Button variant="text" fullWidth onClick={handleCartIncrement}>
        <AddToCartIcon
          sx={{
            height: '32px',
            width: 'auto',
            marginRight: '4px',
          }}
        />
        <Box sx={{ fontSize: '16px' }}>Add</Box>
      </Button>
    );
  }

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
        onClick={onDecrementClicked}
        sx={{ minWidth: 0, padding: '4px' }}
        variant="outlined"
      >
        <Remove />
      </Button>
      <Box
        sx={{
          lineHeight: 1,
          fontSize: '22px',
        }}
      >
        {quantity}
      </Box>
      <Button
        onClick={handleCartIncrement}
        sx={{ minWidth: 0, padding: '4px' }}
        variant="outlined"
      >
        <Add />
      </Button>
    </Box>
  );
}

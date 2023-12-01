import { Box, Button, SxProps, Theme } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cartAtom } from '@/recoil/atoms/cart';
import React, { useEffect, useState } from 'react';
import { userAtom } from '@/recoil/atoms';
import { Add, Remove } from '@mui/icons-material';
import { Product } from '@/misc/product';

interface DecIncButtonProps {
  product: Product;
  sx?: SxProps<Theme>;
}

export default function IncDecButton({ product, sx }: DecIncButtonProps) {
  const [cart, setCart] = useRecoilState(cartAtom);
  const user = useRecoilValue(userAtom);
  const [showDialog, setShowDialog] = useState(false);

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
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowDialog(true);
      return;
    }
    const cartItems = cart.items;
    const quantity = cartItems[product.id]
      ? cartItems[product.id].quantity + 1
      : 1;
    updateQuantity(quantity);
  };

  const onDecrementClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const cartItems = cart.items;
    const quantity = cartItems[product.id]
      ? cartItems[product.id].quantity - 1
      : 0;
    updateQuantity(quantity);
  };

  useEffect(() => {
    if (user && showDialog) {
      setShowDialog(false);
    }
  }, [showDialog, user]);

  const cartItems = cart.items;
  if (!cartItems[product.id] || cartItems[product.id].quantity < 1 || !user) {
    return null;
  }
  const { quantity } = cartItems[product.id];
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          ...sx,
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
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
    </Box>
  );
}

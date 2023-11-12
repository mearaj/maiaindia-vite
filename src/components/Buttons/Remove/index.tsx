import { Box, Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cartAtom } from '@/recoil/atoms/cart';
import { useEffect, useState } from 'react';
import { userAtom } from '@/recoil/atoms';
import { Delete } from '@mui/icons-material';
import { Product } from '@/firebase/product';

interface RemoveButtonProps extends ButtonProps {
  product: Product;
  sx?: SxProps<Theme>;
}

export default function RemoveButton({
  product,
  sx,
  ...otherProps
}: RemoveButtonProps) {
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

  useEffect(() => {
    if (user && showDialog) {
      setShowDialog(false);
    }
  }, [showDialog, user]);

  const cartItems = cart.items;
  if (!cartItems[product.id] || cartItems[product.id].quantity < 1 || !user) {
    return null;
  }
  return (
    <Button
      sx={sx}
      variant="outlined"
      color="error"
      fullWidth
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        updateQuantity(0);
      }}
      {...otherProps}
    >
      <Delete
        sx={{
          height: '32px',
          width: 'auto',
          marginRight: '4px',
        }}
      />
      <Box sx={{ fontSize: '14px' }}>Remove</Box>
    </Button>
  );
}

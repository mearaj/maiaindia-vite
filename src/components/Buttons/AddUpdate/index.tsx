import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  SxProps,
  Theme,
} from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cartAtom } from '@/recoil/atoms/cart';
import AddToCartIcon from '@mui/icons-material/AddShoppingCart';
import React, { useEffect, useState } from 'react';
import { userAtom } from '@/recoil/atoms';
import { Product } from '@/firebase/product';
import SignInButton from '@/components/Buttons/SignIn';
import IncDecButton from '@/components/Buttons/IncDec';

interface AddUpdateButtonProps {
  product: Product;
  sxAddButton?: SxProps<Theme>;
  sxIncDecButtonContainer?: SxProps<Theme>;
}

export default function AddUpdateButton({
  product,
  sxAddButton,
  sxIncDecButtonContainer,
}: AddUpdateButtonProps) {
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

  const handleClose = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowDialog(false);
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
    updateQuantity(1);
  };

  useEffect(() => {
    if (user && showDialog) {
      setShowDialog(false);
    }
  }, [showDialog, user]);

  const cartItems = cart.items;
  if (!cartItems[product.id] || cartItems[product.id].quantity < 1 || !user) {
    return (
      <>
        <Button
          sx={sxAddButton}
          variant="outlined"
          fullWidth
          onClick={handleCartIncrement}
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
        <Dialog open={showDialog && !user} onClose={handleClose}>
          <DialogTitle sx={{ textAlign: 'center' }}>
            Sign In required
          </DialogTitle>
          <DialogActions>
            <SignInButton sx={{ fontSize: '16px', justifyContent: 'center' }} />
          </DialogActions>
        </Dialog>
      </>
    );
  }
  return <IncDecButton sx={sxIncDecButtonContainer} product={product} />;
}

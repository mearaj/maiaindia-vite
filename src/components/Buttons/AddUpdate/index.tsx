import { Box, Button, SxProps, Theme } from '@mui/material';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { cartAtom } from '@/recoil/atoms/cart';
import AddToCartIcon from '@mui/icons-material/AddShoppingCart';
import React from 'react';
import { userAtom } from '@/recoil/atoms';
import { Product } from '@/firebase/product';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import IncDecButton from '@/components/Buttons/IncDec';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';

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
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user.userState) {
      setActiveDialog(<SignInRequiredDialog />);
      return;
    }
    updateQuantity(1);
  };

  const cartItems = cart.items;
  if (!cartItems[product.id] || cartItems[product.id].quantity < 1 || !user) {
    return (
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
    );
  }
  return <IncDecButton sx={sxIncDecButtonContainer} product={product} />;
}

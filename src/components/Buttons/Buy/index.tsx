import { Box, Button, SxProps, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userAtom } from '@/jotai/atoms';
import React from 'react';
import { Product } from '@/jotai/data/product';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { useAtomValue, useSetAtom } from 'jotai';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';

interface ProductActionProps {
  product: Product;
  sx?: SxProps<Theme>;
}

export default function BuyButton({ product, sx }: ProductActionProps) {
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();
  const setActiveDialog = useSetAtom(selectedDialogAtom);

  const handleBuyClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user.userState) {
      setActiveDialog(<SignInRequiredDialog />);
      return;
    }
    navigate(`/products/${product.id}`);
  };

  return (
    <Button sx={sx} variant="outlined" fullWidth onClick={handleBuyClick}>
      <Box sx={{ fontSize: '16px' }}>Buy</Box>
    </Button>
  );
}

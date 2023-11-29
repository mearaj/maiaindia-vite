import { Box, Button, SxProps, Theme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import React from 'react';
import { Product } from '@/firebase/product';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';

interface ProductActionProps {
  product: Product;
  sx?: SxProps<Theme>;
}

export default function BuyButton({ product, sx }: ProductActionProps) {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const setActiveDialog = useSetRecoilState(selectedDialogAtom);

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

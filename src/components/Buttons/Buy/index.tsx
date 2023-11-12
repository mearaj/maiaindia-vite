import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  SxProps,
  Theme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import React, { useState } from 'react';
import { Product } from '@/firebase/product';
import SignInButton from '@/components/Buttons/SignIn';

interface ProductActionProps {
  product: Product;
  sx?: SxProps<Theme>;
}

export default function BuyButton({ product, sx }: ProductActionProps) {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleBuyClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowDialog(true);
      return;
    }
    navigate(`/products/${product.id}`);
  };

  const handleClose = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowDialog(false);
  };

  return (
    <>
      <Button sx={sx} variant="outlined" fullWidth onClick={handleBuyClick}>
        <Box sx={{ fontSize: '16px' }}>Buy</Box>
      </Button>
      <Dialog open={showDialog && !user} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: 'center' }}>Sign In required</DialogTitle>
        <DialogActions>
          <SignInButton sx={{ fontSize: '16px', justifyContent: 'center' }} />
        </DialogActions>
      </Dialog>
    </>
  );
}

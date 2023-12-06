import { Box, Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { cartAtom } from '@/recoil/atoms/cart';
import { userAtom } from '@/recoil/atoms';
import { Delete } from '@mui/icons-material';
import { Product } from '@/recoil/data/product';
import { cartQuantityByProductIDSelector } from '@/recoil/selectors/cart';

interface RemoveButtonProps extends ButtonProps {
  product: Product;
  sx?: SxProps<Theme>;
}

export default function RemoveButton({
  product,
  sx,
  ...otherProps
}: RemoveButtonProps) {
  const cart = useRecoilValue(cartAtom);
  const user = useRecoilValue(userAtom);
  const setQuantity = useSetRecoilState(
    cartQuantityByProductIDSelector(product.id)
  );

  const updateQuantity = (quantityAlt: number) => {
    setQuantity(quantityAlt);
  };

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

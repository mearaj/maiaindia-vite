import { Box, Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { Delete } from '@mui/icons-material';
import { Product } from '@/recoil/data/product';
import { setCartQuantity } from '@/misc';

interface RemoveButtonProps extends ButtonProps {
  product: Product;
  sx?: SxProps<Theme>;
}

export default function RemoveButton({
  product,
  sx,
  ...otherProps
}: RemoveButtonProps) {
  const user = useRecoilValue(userAtom);

  const updateQuantity = async (quantityAlt: number) => {
    await setCartQuantity(user, product.id!, quantityAlt);
  };
  if (!user.userState) {
    return null;
  }
  const cartItems = user.userState?.cart.items;
  if (!cartItems[product.id!] || cartItems[product.id!].quantity < 1) {
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

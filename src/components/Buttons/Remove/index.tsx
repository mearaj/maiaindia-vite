import { Box, Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { userAtom } from '@/jotai/atoms';
import { Product } from '@/jotai/data/product';
import { setCartQuantity } from '@/misc';
import { useAtomValue } from 'jotai/index';

interface RemoveButtonProps extends ButtonProps {
  product: Product;
  sx?: SxProps<Theme>;
}

export default function RemoveButton({
  product,
  sx,
  ...otherProps
}: RemoveButtonProps) {
  const user = useAtomValue(userAtom);

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
      variant="contained"
      color="error"
      fullWidth
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setCartQuantity(user, product.id!, 0);
      }}
      {...otherProps}
    >
      {/* <Delete */}
      {/*  sx={{ */}
      {/*    width: 'auto', */}
      {/*    marginRight: '2px', */}
      {/*  }} */}
      {/* /> */}
      <Box sx={{ fontSize: '14px' }}>Remove</Box>
    </Button>
  );
}

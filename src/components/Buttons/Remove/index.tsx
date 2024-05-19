import { Box, Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { userAtom } from '@/jotai/atoms';
import { CompoundProduct } from '@/jotai/data/product';
import { setCartQuantity } from '@/misc/cart';
import { useAtomValue } from 'jotai/index';

interface RemoveButtonProps extends ButtonProps {
  sx?: SxProps<Theme>;
  compoundProduct: CompoundProduct;
}

export default function RemoveButton({
  compoundProduct,
  sx,
  ...otherProps
}: RemoveButtonProps) {
  const user = useAtomValue(userAtom);
  const { product, variant: productVariant } = compoundProduct;

  if (!user.userState) {
    return null;
  }
  const cartItems = user.userState?.cart.items;
  const compoundID = `${product.id}-${productVariant.id}`;
  if (!cartItems[compoundID] || cartItems[compoundID].quantity < 1) {
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
        setCartQuantity(user, product.id!, productVariant.id!, 0);
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

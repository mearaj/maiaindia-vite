import { Box, Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { userAtom } from '@/jotai/atoms';
import { CompoundProduct } from '@/jotai/data/product';
import { useAtomValue, useSetAtom } from 'jotai/index';
import { cartQuantityAtomFamily } from '@/jotai/families/cart';

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
  const compoundID = `${product.id}-${productVariant.id}`;
  const setCartQuantity = useSetAtom(cartQuantityAtomFamily(compoundID));
  if (!user.userState) {
    return null;
  }
  const cartItems = user.userState?.cart.items;
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
        setCartQuantity(0);
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

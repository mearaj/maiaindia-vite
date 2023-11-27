import { Box, useTheme } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { cartAtom } from '@/recoil/atoms/cart';
import { ReactNode } from 'react';
import createStyles from './styles';
import CartItemComponent from '@/components/CartItem';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function CartPage() {
  const cart = useRecoilValue(cartAtom);
  const theme = useTheme();

  const styles = createStyles(theme);
  console.log(1);

  let selectedComponent: ReactNode;

  if (!cart.items || Object.keys(cart.items).length < 1) {
    selectedComponent = <Box>Your cart is empty!</Box>;
    console.log(2);
  } else {
    console.log(3);
    selectedComponent = (
      <Box sx={styles.cartBody}>
        {Object.keys(cart.items).map((productID) => {
          return <CartItemComponent key={productID} productId={productID} />;
        })}
      </Box>
    );
  }

  return (
    <CommonPageLayout
      showHeader
      sxRootProps={{ ...styles.root, justifyContent: 'flexStart' }}
    >
      {selectedComponent}
    </CommonPageLayout>
  );
}

import { Box, useTheme } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { cartAtom } from '@/recoil/atoms/cart';
import createStyles from './styles';
import CartItemComponent from '@/components/CartItem';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function CartPage() {
  const cart = useRecoilValue(cartAtom);
  const theme = useTheme();
  const styles = createStyles(theme);

  if (!cart.items || Object.keys(cart.items).length < 1) {
    return (
      <CommonPageLayout
        sxBodyProps={{
          ...styles.cartBody,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Your cart is empty!
      </CommonPageLayout>
    );
  }

  return (
    <CommonPageLayout sxRootProps={{ ...styles.root }}>
      <Box sx={styles.cartBody}>
        {Object.keys(cart.items).map((productID) => {
          return <CartItemComponent key={productID} productId={productID} />;
        })}
      </Box>
    </CommonPageLayout>
  );
}

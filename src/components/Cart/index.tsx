import { Box, useTheme } from '@mui/material';
import { userAtom } from '@/jotai/atoms';
import { useAtomValue } from 'jotai';
import createStyles from '@/components/Cart/styles';
import CartItemComponent from '@/components/CartItem';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function CartPage() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const user = useAtomValue(userAtom);

  if (
    !user.userState ||
    !user.userState!.cart.items ||
    Object.keys(user.userState!.cart.items).length < 1
  ) {
    return (
      <CommonPageLayout
        showHeader={false}
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
    <CommonPageLayout showHeader={false} sxRootProps={{ ...styles.root }}>
      <Box sx={styles.cartBody}>
        {Object.keys(user.userState!.cart.items).map((productID) => {
          return <CartItemComponent key={productID} productId={productID} />;
        })}
      </Box>
    </CommonPageLayout>
  );
}

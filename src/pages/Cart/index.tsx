import { Box, useTheme } from '@mui/material';
import { userAtom } from '@/jotai/atoms';
import { useAtomValue } from 'jotai/index';
import createStyles from './styles';
import CartItemComponent from '@/components/CartItem';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function CartPage() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const user = useAtomValue(userAtom);

  if (
    !user.userState!.cart.items ||
    Object.keys(user.userState!.cart.items).length < 1
  ) {
    return (
      <CommonPageLayout
        sxBodyProps={{
          ...styles.cartBody,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        headerProps={{
          showBackIcon: true,
        }}
      >
        Your cart is empty!
      </CommonPageLayout>
    );
  }

  return (
    <CommonPageLayout
      headerProps={{
        showBackIcon: true,
      }}
      sxRootProps={{ ...styles.root }}
    >
      <Box sx={styles.cartBody}>
        {Object.keys(user.userState!.cart.items).map((productID) => {
          return <CartItemComponent key={productID} productId={productID} />;
        })}
      </Box>
    </CommonPageLayout>
  );
}

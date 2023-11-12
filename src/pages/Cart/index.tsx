import { Header } from '@/components';
import { Box, useTheme } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { cartAtom } from '@/recoil/atoms/cart';
import SignInButton from '@/components/Buttons/SignIn';
import createStyles from './styles';
import CartItemComponent from '@/components/CartItem';
import CommonPageLayout from '@/components/CommonPageLayout';

export default function CartPage() {
  const user = useRecoilValue(userAtom);
  const cart = useRecoilValue(cartAtom);
  const theme = useTheme();

  const styles = createStyles(theme);

  if (!user) {
    return (
      <CommonPageLayout>
        <Box>Sign in required</Box>
        <SignInButton />
      </CommonPageLayout>
    );
  }

  if (!cart.items || Object.keys(cart.items).length < 1) {
    return (
      <CommonPageLayout>
        <Box>Your cart is empty!</Box>
      </CommonPageLayout>
    );
  }

  return (
    <Box sx={{ ...styles.root, justifyContent: 'flexStart' }}>
      <Header />
      <Box sx={styles.cartBody}>
        {Object.keys(cart.items).map((productID) => {
          return <CartItemComponent key={productID} productId={productID} />;
        })}
      </Box>
    </Box>
  );
}

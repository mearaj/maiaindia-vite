import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { userAtom } from '@/jotai/atoms';
import { useAtom, useAtomValue } from 'jotai';
import Close from '@mui/icons-material/Close';
import { cartAtom } from '@/jotai/atoms/cart';
import createStyles from '@/components/Cart/styles';
import CartItemComponent from '@/components/CartItem';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function CartPage() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const user = useAtomValue(userAtom);
  const [, setShowCart] = useAtom(cartAtom);

  const isEmpty =
    !user.userState ||
    !user.userState!.cart.items ||
    Object.keys(user.userState!.cart.items).length < 1;
  let headerText = 'Your cart is empty!';
  if (!isEmpty) {
    const numberOfItems = Object.keys(user.userState!.cart.items).length;
    headerText = `Your cart (${numberOfItems})`;
  }

  return (
    <CommonPageLayout showHeader={false} sxRootProps={{ ...styles.root }}>
      <Box sx={styles.cartBody}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {headerText}
          </Typography>
          <IconButton
            sx={{ padding: '0px' }}
            onClick={() => setShowCart(false)}
          >
            <Close color="primary" sx={{ fontWeight: 'bold', fontSize: 32 }} />
          </IconButton>
        </Box>
        {!isEmpty &&
          Object.keys(user.userState!.cart.items).map((productID) => {
            return <CartItemComponent key={productID} productId={productID} />;
          })}
      </Box>
    </CommonPageLayout>
  );
}

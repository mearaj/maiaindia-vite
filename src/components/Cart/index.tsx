import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { userAtom } from '@/jotai/atoms';
import { useAtom, useAtomValue } from 'jotai';
import Close from '@mui/icons-material/Close';
import { showCartAtom } from '@/jotai/atoms/cart';
import { serverTimestamp } from '@firebase/firestore';
import createStyles from '@/components/Cart/styles';
import CartItemComponent from '@/components/CartItem';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function CartPage() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const user = useAtomValue(userAtom);
  const [, setShowCart] = useAtom(showCartAtom);

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
          Object.keys(user.userState!.cart.items)
            .sort((a, b) => {
              const isLess =
                (user.userState?.cart.items[a]?.createdAt ??
                  serverTimestamp()) <
                (user.userState?.cart.items[b]?.createdAt ?? serverTimestamp());
              if (isLess) {
                return -1;
              }
              return 1;
            })
            .map((compoundIDStr) => {
              const compoundIDArr = (compoundIDStr ?? ' - ').split('-');
              const compoundID = {
                productID: compoundIDArr[0],
                variantID: compoundIDArr[1],
              };
              return (
                <CartItemComponent
                  key={compoundIDStr}
                  compoundID={compoundID}
                />
              );
            })}
      </Box>
    </CommonPageLayout>
  );
}

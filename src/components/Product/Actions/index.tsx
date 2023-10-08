import { Box, Button } from '@mui/material';
import { Product } from '@/store/data/data';
import AddToCartIcon from '@mui/icons-material/AddShoppingCart';
import { useAppDispatch } from '@/store';
import {
  setHomeActiveProduct,
  setShowGlobalLoader,
} from '@/store/features/ui.ts';
import { useParams } from 'react-router-dom';
import styles from './index.module.css';
import Element = React.JSX.Element;

export default function ProductActions({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const params = useParams();
  let button: Element | null = null;
  if (params.id !== product.id) {
    button = (
      <Button
        className={`${styles.button}`}
        variant="contained"
        fullWidth
        href={`/products/${product.id}`}
        onClick={(_) => {
          dispatch(setHomeActiveProduct(''));
          dispatch(setShowGlobalLoader(true));
        }}
      >
        Details
      </Button>
    );
  }

  return (
    <Box className={styles.buttons}>
      {button}
      <Button
        className={`${styles.button} ${styles.addToCartButton}`}
        variant="contained"
        fullWidth
        onClick={(__) => {}}
      >
        <AddToCartIcon className={styles.icon} />
        <div className={styles.text}>Add</div>
      </Button>
      <Button
        className={`${styles.button}`}
        variant="contained"
        fullWidth
        onClick={() => {}}
      >
        <div className={styles.text}>Buy</div>
      </Button>
    </Box>
  );
}

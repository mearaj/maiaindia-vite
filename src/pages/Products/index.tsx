import { Header } from '@/components';
import { Box } from '@mui/material';
import Products from '@/components/Products';
import Videos from '@/components/Videos';
import styles from './index.module.css';

export default function ProductsPage() {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative',
        overflowY: 'auto',
      }}
    >
      <Header />
      <Videos className={styles.videosContainer} />
      <Products />
    </Box>
  );
}

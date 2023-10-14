import { Header } from '@/components';
import { Box } from '@mui/material';
import Products from '@/components/Products';
import Videos from '@/components/Videos';
import styles from './index.module.css';

export default function CategoriesPage() {
  return (
    <Box className={styles.layout}>
      <Header />
      <Videos className={styles.videosContainer} />
      <Products />
    </Box>
  );
}

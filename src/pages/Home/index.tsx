import { Header } from '@/components';
import { Box } from '@mui/material';
import Products from '@/components/Products';
import Videos from '@/components/Videos';
import styles from './index.module.css';

export default function CategoriesPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1',
        width: '100%',
        flexShrink: '1',
        position: 'relative',
      }}
    >
      <Header />
      <Videos className={styles.videosContainer} />
      <Products />
    </Box>
  );
}

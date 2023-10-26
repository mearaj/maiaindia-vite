import { Header, Loader } from '@/components';
import { Box } from '@mui/material';
import { Suspense } from 'react';
import Products from '@/components/Products';
import Videos from '@/components/Videos';
import styles from './index.module.css';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function HomePage() {
  return (
    <ErrorBoundary fallback={<Box>Something went wrong</Box>}>
      <Suspense fallback={<Loader />}>
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
      </Suspense>
    </ErrorBoundary>
  );
}

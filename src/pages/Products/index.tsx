import { Header, Loader } from '@/components';
import { Box } from '@mui/material';
import { useRecoilValueLoadable } from 'recoil';
import { productsSelector } from '@/recoil';
import { ReactNode } from 'react';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import Products from '@/components/Products';
import Videos from '@/components/Videos';
import styles from './index.module.css';

export default function ProductsPage() {
  const { contents, state } = useRecoilValueLoadable(productsSelector);
  let selectedComponent: ReactNode;
  if (state === 'hasError') {
    selectedComponent = (
      <CommonPageLayout>
        <Box>{contents}</Box>
      </CommonPageLayout>
    );
  } else if (state === 'loading') {
    selectedComponent = <Loader showHeader />;
    return selectedComponent;
  } else {
    selectedComponent = <Products products={contents} />;
  }
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
      {selectedComponent}
    </Box>
  );
}

import { Header, Loader } from '@/components';
import { Box } from '@mui/material';
import { useRecoilValueLoadable } from 'recoil';
import { productsSelector } from '@/recoil';
import { ReactNode } from 'react';
import AdminProducts from '@/components/Admin/AdminProducts';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function AdminProductsPage() {
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
    selectedComponent = <AdminProducts products={contents} />;
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
      {selectedComponent}
    </Box>
  );
}

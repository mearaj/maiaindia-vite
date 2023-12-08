import { Box } from '@mui/material';
import { Product } from '@/recoil/data/product';
import AdminProductComponent from '@/components/Admin/Product';

function AdminProducts({ products }: { products: Product[] }) {
  return (
    <Box
      sx={{
        padding: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '12px 8px',
        '@media (min-width: 1000px)': {
          gridTemplateColumns: '1fr 1fr 1fr',
          padding: '32px',
          gridGap: '32px',
        },
      }}
    >
      {products &&
        products.map((el: Product) => {
          return <AdminProductComponent key={el.id} product={el} />;
        })}
    </Box>
  );
}

export default AdminProducts;

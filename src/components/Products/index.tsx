import { Box } from '@mui/material';
import { Product } from '@/misc/product';
import ProductComponent from '@/components/Product';

function Products({ products }: { products: Product[] }) {
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
          return <ProductComponent key={el.id} product={el} />;
        })}
    </Box>
  );
}

export default Products;

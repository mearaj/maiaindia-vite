import { Box } from '@mui/material';
import { Product } from '@/data/store';
import { useRecoilValue } from 'recoil';
import { productsSelector } from '@/recoil/state';
import ProductComponent from '@/components/Product';

function Products() {
  const products = useRecoilValue(productsSelector);

  return (
    <Box
      sx={{
        padding: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '24px 8px',
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

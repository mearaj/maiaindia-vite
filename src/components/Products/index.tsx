import { Box } from '@mui/material';
import { Product } from '@/recoil/data/product';
import { useRecoilValueLoadable } from 'recoil';
import { Loader } from '@/components';
import { productsSelector } from '@/recoil';
import ProductComponent from '@/components/Product';

function Products() {
  const productsLoadable = useRecoilValueLoadable(productsSelector);
  const { data: products, error } = productsLoadable.contents;

  if (productsLoadable.state === 'hasError' || error) {
    return <Box>{error}</Box>;
  }

  if (productsLoadable.state === 'loading') {
    return <Loader />;
  }

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

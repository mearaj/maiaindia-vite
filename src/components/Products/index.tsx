import { Box } from '@mui/material';
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import { Loader } from '@/components';
import { productsSelector } from '@/recoil';
import { Product } from '@/firebase/product';
import { useEffect } from 'react';
import { appFirestore } from '@/firebase';
import { collection, onSnapshot, query } from '@firebase/firestore';
import ProductComponent from '@/components/Product';

function Products() {
  const productsLoadable = useRecoilValueLoadable(productsSelector);
  const { data: products, error } = productsLoadable.contents;
  const productsReload = useRecoilRefresher_UNSTABLE(productsSelector);

  // Whenever the product is updated in the backend, this function
  // clear caches and forces re-evaluation (by re-fetching products)
  // https://recoiljs.org/docs/guides/asynchronous-data-queries
  // https://firebase.google.com/docs/firestore/query-data/listen
  useEffect(() => {
    const productsRef = collection(appFirestore, 'products');
    const productsQuery = query(productsRef);
    return onSnapshot(productsQuery, (_querySnapshot) => {
      productsReload();
    });
  }, [productsReload]);

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

import { useGetProductsQuery } from '@/store/api/api';
import { Loader } from '@/components';
import { Box } from '@mui/material';
import { defaultCategory } from '@/store/data/data';
import { selectCategory, useAppSelector } from '@/store';
import {
  collection,
  DocumentData,
  query,
  Query,
  where,
} from '@firebase/firestore';
import ProductItem from '@/components/Product/Item/item';
import { firestore } from '@/config/firebase';

function Products() {
  const category = useAppSelector(selectCategory);
  const generateQuery: () => Query<DocumentData, DocumentData> = () => {
    const productsRef = collection(firestore, 'products');
    let productsQuery: Query<DocumentData, DocumentData>;
    if (!category || category.id === defaultCategory.id) {
      productsQuery = query(productsRef);
    } else {
      productsQuery = query(
        productsRef,
        where('categoryID', '==', category.id)
      );
    }
    return productsQuery;
  };

  const { isFetching: isFetchingProducts, data: products } =
    useGetProductsQuery(generateQuery());
  if (isFetchingProducts) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        padding: '16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridGap: '32px 16px',
        gridAutoRows: '1fr',
        '@media (min-width: 1000px)': {
          gridTemplateColumns: '1fr 1fr 1fr',
          padding: '32px',
          gridGap: '32px 32px',
        },
      }}
    >
      {products &&
        products.map((el) => {
          return <ProductItem key={el.id} product={el} />;
        })}
    </Box>
  );
}

export default Products;

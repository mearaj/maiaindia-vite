import { useGetProductsQuery } from '@/store/api/api';
import { Loader } from '@/components';
import { Box } from '@mui/material';
import {
  collection,
  DocumentData,
  Query,
  query,
  where,
} from '@firebase/firestore';
import { categories } from '@/data/store';
import { useContext } from 'react';
import { appFirestore } from '@/firebase';
import ProductComponent from '@/components/Product';
import { CategoriesContext } from '@/providers/categories';

function Products() {
  const categoryContext = useContext(CategoriesContext);
  const generateQuery: () => Query<DocumentData, DocumentData> = () => {
    const productsRef = collection(appFirestore, 'products');
    let productsQuery: Query<DocumentData, DocumentData> = query(productsRef);
    const found = categories.find(
      (eachCategory) => eachCategory.id === categoryContext.category.id
    );
    if (!found) {
      productsQuery = query(productsRef);
    } else {
      productsQuery = query(
        productsRef,
        where('categoryID', '==', categoryContext.category.id ?? '')
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
        products.map((el) => {
          return <ProductComponent key={el.id} product={el} />;
        })}
    </Box>
  );
}

export default Products;

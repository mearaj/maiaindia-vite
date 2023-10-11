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
import styles from './index.module.css';
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

  console.log(products);

  return (
    <Box className={styles.container}>
      {products &&
        products.map((el) => {
          return <ProductItem key={el.id} product={el} />;
        })}
    </Box>
  );
}

export default Products;

import { Header, Loader } from '@/components';
import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import { Product, ProductForm } from '@/recoil/data/product';
import { categories } from '@/recoil/data/category';
import styles from './index.module.css';
import { appAbsoluteRoutes } from '@/Router';
import AddEditProductComponent from '@/components/Admin/AddEditProduct';
import AddEditProductImages from '@/components/Admin/AddEditProductImages';

export default function AdminProductDetailsPage() {
  const params = useParams();
  const { contents, state } = useRecoilValueLoadable(
    productIdSelector(params.id as string)
  );

  const navigate = useNavigate();

  if (state === 'hasError') {
    return (
      <Box className={styles.layout}>
        <Header />
        <Box className={styles.bodyAlt}>{contents.toString()}</Box>
      </Box>
    );
  }
  if (state === 'loading') {
    return <Loader showHeader />;
  }

  const product = contents as Product;
  const productForm: ProductForm = {
    id: product.id,
    name: product.name,
    details: product.details,
    mrp: product.price.mrp,
    sp: product.price.sp,
    category:
      categories.find((eachCategory) => eachCategory.id === product.id) ??
      categories[categories.length - 1],
  };

  return (
    <Box className={styles.layout}>
      <Header
        showBackIcon
        onBackIconClick={() => {
          navigate(appAbsoluteRoutes.adminProducts);
        }}
      />
      <Box className={styles.body}>
        <AddEditProductComponent productForm={productForm} />
        <AddEditProductImages product={product} />
      </Box>
    </Box>
  );
}

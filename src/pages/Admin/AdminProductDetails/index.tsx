import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import {
  defaultProductForm,
  Product,
  ProductForm,
} from '@/recoil/data/product';
import { categories } from '@/recoil/data/category';
import styles from './index.module.css';
import { appAbsoluteRoutes } from '@/Router';
import AddEditProductComponent from '@/components/Admin/AddEditProduct';
import AddEditProductImages from '@/components/Admin/AddEditProductImages';
import RecoilLoadablePageLayout from '@/components/Layouts/RecoilLoadablePage';

export default function AdminProductDetailsPage() {
  const params = useParams();
  const recoilValueLoadable = useRecoilValueLoadable(
    productIdSelector(params.id as string)
  );

  const navigate = useNavigate();

  let product: Product | undefined;
  let productForm: ProductForm = defaultProductForm;
  if (
    recoilValueLoadable.state === 'hasValue' &&
    recoilValueLoadable.contents
  ) {
    product = recoilValueLoadable.contents as Product;
    productForm = {
      id: product.id,
      name: product.name,
      details: product.details,
      mrp: product.price.mrp,
      sp: product.price.sp,
      category:
        categories.find(
          (eachCategory) => product?.id && eachCategory.id === product.id
        ) ?? categories[categories.length - 1],
    };
  }

  return (
    <RecoilLoadablePageLayout
      recoilLoadable={recoilValueLoadable}
      headerProps={{
        onBackIconClick: () => {
          navigate(appAbsoluteRoutes.adminProducts);
        },
      }}
      showHeader
    >
      <Box className={styles.body}>
        {productForm.id !== null && (
          <AddEditProductComponent productForm={productForm} />
        )}
        {product && <AddEditProductImages product={product} />}
      </Box>
    </RecoilLoadablePageLayout>
  );
}

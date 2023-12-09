import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import { categories } from '@/recoil/data/category';
import {
  defaultProductFormState,
  productFormStateAtom,
} from '@/recoil/atoms/productForm';
import { useEffect } from 'react';
import { ProductForm } from '@/recoil/data/product';
import styles from './index.module.css';
import { appAbsoluteRoutes } from '@/Router';
import AddEditProductComponent from '@/components/Admin/AddEditProduct';
import AddEditProductImagesComponent from '@/components/Admin/AddEditProductImages';
import RecoilLoadablePageLayout from '@/components/Layouts/RecoilLoadablePage';
import AdminProductProcessingStateComponent from '@/components/Admin/ProductProcessingState';

export default function AdminProductDetailsPage() {
  const params = useParams();
  const recoilValueLoadable = useRecoilValueLoadable(
    productIdSelector(params.id as string)
  );

  const navigate = useNavigate();
  const setProductFormState = useSetRecoilState(productFormStateAtom);

  const product =
    recoilValueLoadable.state === 'hasValue' && recoilValueLoadable.contents
      ? recoilValueLoadable.contents
      : undefined;

  useEffect(() => {
    if (!product) {
      setProductFormState(defaultProductFormState);
    } else {
      const productForm: ProductForm = {
        details: product.details,
        mrp: product.price.mrp,
        sp: product.price.sp,
        name: product.name,
        id: product.id,
        category:
          categories.find(
            (eachCategory) => product?.id && eachCategory.id === product.id
          ) ?? categories[categories.length - 1],
      };
      setProductFormState({
        ...defaultProductFormState,
        productForm,
      });
    }
  }, [product, setProductFormState]);

  return (
    <>
      <AdminProductProcessingStateComponent />
      <RecoilLoadablePageLayout
        recoilLoadable={recoilValueLoadable}
        headerProps={{
          showBackIcon: true,
          onBackIconClick: () => {
            navigate(appAbsoluteRoutes.adminProducts);
          },
        }}
      >
        <Box className={styles.body}>
          <AddEditProductComponent />
          {product && <AddEditProductImagesComponent product={product} />}
        </Box>
      </RecoilLoadablePageLayout>
    </>
  );
}

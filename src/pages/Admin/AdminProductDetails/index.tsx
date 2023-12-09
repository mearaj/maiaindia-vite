import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import { categories } from '@/recoil/data/category';
import {
  defaultProductFormState,
  productFormStateAtom,
} from '@/recoil/atoms/productForm';
import * as React from 'react';
import { SyntheticEvent, useCallback, useEffect, useMemo } from 'react';
import { ProductForm } from '@/recoil/data/product';
import { imagesByProductIDSelector } from '@/recoil/selectors/products';
import styles from './index.module.css';
import { appAbsoluteRoutes } from '@/Router';
import AddEditProductComponent from '@/components/Admin/AddEditProduct';
import AddEditProductImagesComponent from '@/components/Admin/AddEditProductImages';
import RecoilLoadablePageLayout from '@/components/Layouts/RecoilLoadablePage';
import AdminProductFormFooterComponent from '@/components/Admin/ProductFormFooter';
import RecoilLoadableComponent from '@/components/Layouts/RecoilLoadableComponent';

export default function AdminProductDetailsPage() {
  const params = useParams();
  const recoilProductValueLoadable = useRecoilValueLoadable(
    productIdSelector(params.id as string)
  );
  const recoilProductImagesValueLoadable = useRecoilValueLoadable(
    imagesByProductIDSelector(params.id as string)
  );

  const setProductFormState = useSetRecoilState(productFormStateAtom);
  const navigate = useNavigate();

  const product =
    recoilProductValueLoadable.state === 'hasValue' &&
    recoilProductValueLoadable.contents
      ? recoilProductValueLoadable.contents
      : undefined;
  const productImages = useMemo(() => {
    return product &&
      recoilProductImagesValueLoadable.state === 'hasValue' &&
      recoilProductImagesValueLoadable.contents
      ? recoilProductImagesValueLoadable.contents
      : [];
  }, [
    product,
    recoilProductImagesValueLoadable.contents,
    recoilProductImagesValueLoadable.state,
  ]);

  const handleReset = useCallback(
    (
      event?:
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | SyntheticEvent<Element, Event>
    ) => {
      if (event) {
        event.preventDefault();
      }
      const shouldReset =
        recoilProductImagesValueLoadable.state === 'hasValue' &&
        recoilProductValueLoadable.state === 'hasValue';
      if (shouldReset && product && productImages) {
        const newProductForm: ProductForm = {
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
          productForm: newProductForm,
          images: productImages,
        });
      }
    },
    [product, productImages, setProductFormState]
  );

  useEffect(() => {
    handleReset();
    return () => {
      handleReset();
    };
  }, [handleReset]);

  return (
    <RecoilLoadablePageLayout
      recoilLoadable={recoilProductValueLoadable}
      headerProps={{
        showBackIcon: true,
        onBackIconClick: () => {
          navigate(appAbsoluteRoutes.adminProducts);
        },
      }}
    >
      <Box className={styles.body}>
        <AddEditProductComponent />
        <RecoilLoadableComponent
          loaderContainerStyle={{ width: '100%', height: '40vh' }}
          errorContainerStyle={{ width: '100%', height: '40vh' }}
          recoilLoadable={recoilProductImagesValueLoadable}
        >
          {productImages && <AddEditProductImagesComponent />}
        </RecoilLoadableComponent>
        <AdminProductFormFooterComponent handleReset={handleReset} />
      </Box>
    </RecoilLoadablePageLayout>
  );
}

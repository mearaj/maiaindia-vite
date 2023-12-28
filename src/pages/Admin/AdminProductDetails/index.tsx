import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import { categories } from '@/recoil/data/category';
import {
  defaultProductFormState,
  productFormStateAtom,
} from '@/recoil/atoms/productForm';
import * as React from 'react';
import { SyntheticEvent, useCallback, useEffect } from 'react';
import { ProductForm } from '@/recoil/data/product';
import {
  productFormLocalImagesSelector,
  productFormModeStateSelector,
  productFormProcessingStateSelector,
  productFormSelector,
} from '@/recoil/selectors/productForm';
import styles from './index.module.css';
import { appAbsoluteRoutes } from '@/Router';
import AddEditProductComponent from '@/components/Admin/AddEditProduct';
import AddEditProductImagesComponent from '@/components/Admin/AddEditProductImages';
import RecoilLoadablePageLayout from '@/components/Layouts/RecoilLoadablePage';
import AdminProductFormFooterComponent from '@/components/Admin/ProductFormFooter';

export default function AdminProductDetailsPage() {
  const params = useParams();
  const recoilProductValueLoadable = useRecoilValueLoadable(
    productIdSelector(params.id as string)
  );

  const setProductFormState = useSetRecoilState(productFormStateAtom);
  const productForm = useRecoilValue(productFormSelector);
  const navigate = useNavigate();
  const locallyUploadedImages = useRecoilValue(productFormLocalImagesSelector);
  const isProcessing = useRecoilValue(productFormProcessingStateSelector);
  const formMode = useRecoilValue(productFormModeStateSelector);

  const product =
    recoilProductValueLoadable.state === 'hasValue' &&
    recoilProductValueLoadable.contents
      ? recoilProductValueLoadable.contents
      : undefined;

  const handleReset = useCallback(
    (
      event?:
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | SyntheticEvent<Element, Event>
    ) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const shouldReset =
        recoilProductValueLoadable.state === 'hasValue' && !isProcessing;

      if (shouldReset && product) {
        const newProductForm: ProductForm = {
          details: product.details ?? '',
          mrp: product.mrp,
          sp: product.sp,
          name: product.name,
          id: product.id,
          category:
            categories.find(
              (eachCategory) =>
                product?.categoryID && eachCategory.id === product.categoryID
            ) ?? categories[categories.length - 1],
        };
        locallyUploadedImages.forEach((eachImage) =>
          URL.revokeObjectURL(eachImage.url)
        );
        setProductFormState({
          ...defaultProductFormState,
          productForm: newProductForm,
          images: product.images,
        });
      }
    },
    [
      locallyUploadedImages,
      isProcessing,
      product,
      recoilProductValueLoadable.state,
      setProductFormState,
    ]
  );

  useEffect(() => {
    if (recoilProductValueLoadable.state === 'hasValue') {
      const newProduct = recoilProductValueLoadable.contents;
      const newProductForm: ProductForm = {
        details: newProduct.details ?? '',
        mrp: newProduct.mrp,
        sp: newProduct.sp,
        name: newProduct.name,
        id: newProduct.id,
        category:
          categories.find(
            (eachCategory) =>
              newProduct?.categoryID &&
              eachCategory.id === newProduct.categoryID
          ) ?? categories[categories.length - 1],
      };
      setProductFormState({
        ...defaultProductFormState,
        productForm: newProductForm,
        images: product?.images,
        mode: formMode,
      });
    }
  }, [
    formMode,
    product?.images,
    productForm.id,
    recoilProductValueLoadable.contents,
    recoilProductValueLoadable.state,
    setProductFormState,
  ]);

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
        {product && (
          <>
            {productForm.id !== null && <AddEditProductComponent />}
            {product.images && product.images.length > 0 && (
              <AddEditProductImagesComponent />
            )}
            <AdminProductFormFooterComponent handleReset={handleReset} />
          </>
        )}
      </Box>
    </RecoilLoadablePageLayout>
  );
}

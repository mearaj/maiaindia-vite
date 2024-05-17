import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { productIdSelector } from '@/jotai/atoms/productId';
import { categories } from '@/jotai/data/category';
import {
  defaultProductFormState,
  productFormLocalImagesSelector,
  productFormModeStateSelector,
  productFormProcessingStateSelector,
  productFormSelector,
  productFormStateAtom,
} from '@/jotai/atoms/productForm';
import * as React from 'react';
import { SyntheticEvent, useCallback, useEffect } from 'react';
import { ProductForm } from '@/jotai/data/product';
import { useAtomValue, useSetAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import LoadablePageLayout from '@/components/Layouts/JotailLoadablePage';
import styles from './index.module.css';
import { appAbsoluteRoutes } from '@/Router';
import AddEditProductComponent from '@/components/Admin/AddEditProduct';
import AddEditProductImagesComponent from '@/components/Admin/AddEditProductImages';
import AdminProductFormFooterComponent from '@/components/Admin/ProductFormFooter';

export default function AdminProductDetailsPage() {
  const params = useParams();
  const productWithImagesLoadable = loadable(
    productIdSelector(params.id as string)
  );
  const productValueLoadable = useAtomValue(productWithImagesLoadable);

  const setProductFormState = useSetAtom(productFormStateAtom);
  const productForm = useAtomValue(productFormSelector);
  const navigate = useNavigate();
  const locallyUploadedImages = useAtomValue(productFormLocalImagesSelector);
  const isProcessing = useAtomValue(productFormProcessingStateSelector);
  const formMode = useAtomValue(productFormModeStateSelector);

  const product =
    productValueLoadable.state === 'hasData' && productValueLoadable.data
      ? productValueLoadable.data
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
        productValueLoadable.state === 'hasData' && !isProcessing;

      if (shouldReset && product) {
        const newProductForm: ProductForm = {
          details: product.details ?? '',
          name: product.name,
          id: product.id,
          variants: product.variants,
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
      productValueLoadable.state,
      setProductFormState,
    ]
  );

  useEffect(() => {
    if (productValueLoadable.state === 'hasData') {
      const newProduct = productValueLoadable.data;
      const newProductForm: ProductForm = {
        details: newProduct.details ?? '',
        name: newProduct.name,
        id: newProduct.id,
        variants: newProduct.variants,
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
    productValueLoadable.state,
    setProductFormState,
  ]);

  return (
    <LoadablePageLayout
      jotaiLoadable={productValueLoadable}
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
    </LoadablePageLayout>
  );
}

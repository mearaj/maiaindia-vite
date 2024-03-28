import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { productIdAtom, productIdSelector } from '@/jotai/selectors/productId';
import { categories } from '@/jotai/data/category';
import {
  defaultProductFormState,
  productFormStateAtom,
} from '@/jotai/atoms/productForm';
import * as React from 'react';
import { SyntheticEvent, useCallback, useEffect } from 'react';
import { ProductForm } from '@/jotai/data/product';
import {
  productFormLocalImagesSelector,
  productFormModeStateSelector,
  productFormProcessingStateSelector,
  productFormSelector,
} from '@/jotai/selectors/productForm';
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
  const setProductID = useSetAtom(productIdAtom);
  const productWithImagesLoadable = loadable(productIdSelector);
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
      productValueLoadable.state,
      setProductFormState,
    ]
  );

  useEffect(() => {
    if (productValueLoadable.state === 'hasData') {
      const newProduct = productValueLoadable.data;
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
    productValueLoadable.state,
    setProductFormState,
  ]);

  useEffect(() => {
    setProductID(params.id as string);
  }, [params.id as string, setProductID]);

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

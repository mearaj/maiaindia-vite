import { Box, useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { productFormStateAtom } from '@/jotai/atoms/productForm';
import * as React from 'react';
import { SyntheticEvent, useCallback, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  defaultProductFormState,
  ProductFormModeState,
} from '@/jotai/data/product';
import { categories } from '@/jotai/data/category';
import { loadable } from 'jotai/utils';
import { firestoreAutoId } from '@/misc/id';
import { productWithImagesSelector } from '@/jotai/families/products';
import createStyles from './styles';
import { appAbsoluteRoutes } from '@/Router';
import CommonPageLayout from '@/components/Layouts/CommonPage';

import Loader from '@/components/Loader';
import AdminProductDetailsComponent from '@/components/Admin/ProductDetails';

export default function AdminProductDetailsPage() {
  const params = useParams();
  const productID = params.id;
  const productLoadable = useAtomValue(
    loadable(productWithImagesSelector(productID ?? ''))
  );
  const setProductFormState = useSetAtom(productFormStateAtom);
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = createStyles(theme);

  const product =
    productLoadable.state === 'hasData' && productLoadable.data
      ? productLoadable.data
      : null;
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
      if (productID === 'add') {
        setProductFormState({
          ...defaultProductFormState,
          isNew: true,
          mode: ProductFormModeState.edit,
          productForm: {
            ...defaultProductFormState.productForm,
            id: firestoreAutoId(),
          },
        });
      } else if (product) {
        const variants =
          product.variants.map((variant) => ({
            ...variant,
            imagesForDeletion: [],
            localImages: [],
          })) ?? [];
        setProductFormState({
          ...defaultProductFormState,
          productForm: {
            ...product,
            variants,
            category:
              categories.find(
                (eachCategory) =>
                  product.categoryID && eachCategory.id === product.categoryID
              ) ?? categories[categories.length - 1],
          },
          mode: ProductFormModeState.edit,
        });
      }
    },
    [productID, product, setProductFormState]
  );

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  const headerProps = {
    showBackIcon: true,
    onBackIconClick: () => {
      navigate(appAbsoluteRoutes.adminProducts);
    },
  };

  if (productLoadable.state === 'loading') {
    return (
      <CommonPageLayout headerProps={headerProps}>
        <Box sx={styles.bodyAlt}>
          <Box>Loading...</Box>
          <Loader />
        </Box>
      </CommonPageLayout>
    );
  }
  if (productLoadable.state === 'hasError' && productID !== 'add') {
    return (
      <CommonPageLayout headerProps={headerProps}>
        <Box sx={styles.bodyAlt}>
          {(productLoadable.error as Error).toString()}
        </Box>
      </CommonPageLayout>
    );
  }

  return (
    <CommonPageLayout headerProps={headerProps}>
      <AdminProductDetailsComponent handleReset={handleReset} />
    </CommonPageLayout>
  );
}

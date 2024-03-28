import * as React from 'react';
import { SyntheticEvent, useCallback, useEffect } from 'react';
import {
  defaultProductFormState,
  productFormStateAtom,
} from '@/jotai/atoms/productForm';
import { useNavigate } from 'react-router-dom';
import { ProductFormModeState } from '@/jotai/data/product';
import { useSetAtom } from 'jotai';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import AddEditProductComponent from '@/components/Admin/AddEditProduct';
import { appAbsoluteRoutes } from '@/Router';
import AdminProductFormFooterComponent from '@/components/Admin/ProductFormFooter';

export default function AdminAddProductPage() {
  const setProductFormState = useSetAtom(productFormStateAtom);
  const navigate = useNavigate();

  const handleReset = useCallback(
    (
      event?:
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | SyntheticEvent<Element, Event>
    ) => {
      if (event) {
        event.preventDefault();
      }
      setProductFormState({
        ...defaultProductFormState,
        mode: ProductFormModeState.edit,
      });
    },
    [setProductFormState]
  );

  useEffect(() => {
    setProductFormState({
      ...defaultProductFormState,
      mode: ProductFormModeState.edit,
    });
    return handleReset;
  }, [handleReset, setProductFormState]);

  return (
    <CommonPageLayout
      headerProps={{
        showBackIcon: true,
        onBackIconClick: () => {
          navigate(appAbsoluteRoutes.adminProducts);
        },
      }}
    >
      <AddEditProductComponent />
      <AdminProductFormFooterComponent handleReset={handleReset} />
    </CommonPageLayout>
  );
}

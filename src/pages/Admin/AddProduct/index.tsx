import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  defaultProductFormState,
  productFormStateAtom,
} from '@/recoil/atoms/productForm';
import { useNavigate } from 'react-router-dom';
import { ProductFormModeState } from '@/recoil/data/product';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import AddEditProductComponent from '@/components/Admin/AddEditProduct';
import { appAbsoluteRoutes } from '@/Router';

export default function AdminAddProductPage() {
  const setProductFormState = useSetRecoilState(productFormStateAtom);
  const navigate = useNavigate();
  useEffect(() => {
    setProductFormState({
      ...defaultProductFormState,
      mode: ProductFormModeState.edit,
    });
    return () => {
      setProductFormState(defaultProductFormState);
    };
  }, [setProductFormState]);
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
    </CommonPageLayout>
  );
}

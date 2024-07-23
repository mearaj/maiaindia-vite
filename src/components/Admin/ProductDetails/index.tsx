import { Box, IconButton, useTheme } from '@mui/material';
import { productFormStateAtom } from '@/jotai/atoms/productForm';
import * as React from 'react';
import { Fragment, SyntheticEvent } from 'react';
import { useAtom } from 'jotai';
import { Add } from '@mui/icons-material';
import { Currency } from '@/jotai/data/currency';
import { firestoreAutoId } from '@/misc/id';
import AddEditVariantComponent from '@/components/Admin/ProductDetails/AddEditVariant';
import AddEditProductComponent from '@/components/Admin/ProductDetails/AddEditProduct';
import AdminVariantFormFooter from '@/components/Admin/ProductDetails/VariantFormFooter';
import AdminProductFormFooterComponent from '@/components/Admin/ProductDetails/ProductFormFooter';
import createStyles from './styles';

export interface AdminProductDetailsComponentProps {
  handleReset: (
    event?:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | SyntheticEvent<Element, Event>
  ) => void;
}

export default function AdminProductDetailsComponent({
  handleReset,
}: AdminProductDetailsComponentProps) {
  const [productState, setProductFormState] = useAtom(productFormStateAtom);
  const { productForm } = productState;
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Box sx={styles.body}>
      <IconButton
        color="secondary"
        onClick={() => {
          if (!productForm.id) {
            productForm.id = firestoreAutoId();
          }
          productForm.variants.push({
            productID: productForm.id,
            id: firestoreAutoId(),
            currency: Currency.INR,
            mrp: null,
            sp: null,
            size: '',
            color: '',
            images: [],
            imagesForDeletion: [],
            localImages: [],
          });
          setProductFormState({
            ...productState,
            productForm,
          });
        }}
        sx={styles.addVariantBtn}
      >
        <Add sx={{ fontSize: '40px' }} />
      </IconButton>
      <AddEditProductComponent />
      {productForm &&
        productForm.variants &&
        productForm.variants.length > 0 &&
        productForm?.variants.map((variant) => (
          <Fragment key={variant.id}>
            <AddEditVariantComponent variant={variant} />
            <AdminVariantFormFooter variant={variant} />
          </Fragment>
        ))}
      <AdminProductFormFooterComponent handleReset={handleReset} />
    </Box>
  );
}

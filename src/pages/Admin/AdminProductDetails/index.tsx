import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  defaultProductFormState,
  productFormStateAtom,
} from '@/jotai/atoms/productForm';
import * as React from 'react';
import { SyntheticEvent, useCallback, useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { ProductFormModeState } from '@/jotai/data/product';
import { compoundProductSelector } from '@/jotai/atoms/products';
import { categories } from '@/jotai/data/category';
import styles from './index.module.css';
import { appAbsoluteRoutes } from '@/Router';
import AddEditProductComponent from '@/components/Admin/AddEditProduct';
import AddEditProductImagesComponent from '@/components/Admin/AddEditProductImages';
import AdminProductFormFooterComponent from '@/components/Admin/ProductFormFooter';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function AdminProductDetailsPage() {
  const params = useParams();
  const productID = params.id;
  const compoundProduct = useAtomValue(
    compoundProductSelector(productID ?? '')
  );
  const [productState, setProductFormState] = useAtom(productFormStateAtom);
  const { productForm, isProcessing, mode: formMode } = productState;
  const navigate = useNavigate();

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

      if (!isProcessing) {
        // const { product } = compoundProduct;
        // const newProductForm: ProductForm = {
        //   details: product.details ?? '',
        //   name: product.name,
        //   id: product.id,
        //   variants: product.variants,
        //   category:
        //     categories.find(
        //       (eachCategory) =>
        //         product?.categoryID && eachCategory.id === product.categoryID
        //     ) ?? categories[categories.length - 1],
        // };
        // variant.localImages ??
        //   [].forEach((eachImage: LocallyUploadedImage) =>
        //     URL.revokeObjectURL(eachImage.url)
        //   );
        // setProductFormState({
        //   ...defaultProductFormState,
        //   productForm: newProductForm,
        // });
      }
    },
    [isProcessing]
  );

  useEffect(() => {
    if (productID === 'add') {
      setProductFormState({
        ...defaultProductFormState,
        mode: ProductFormModeState.edit,
      });
    } else if (compoundProduct) {
      setProductFormState({
        ...defaultProductFormState,
        productForm: {
          ...compoundProduct.product,
          category:
            categories.find(
              (eachCategory) =>
                compoundProduct.product.categoryID &&
                eachCategory.id === compoundProduct.product.categoryID
            ) ?? categories[categories.length - 1],
        },
        mode: ProductFormModeState.edit,
      });
    }
    // const newCompoundProduct = productValueLoadable.data;
    // const newProduct = newCompoundProduct.product;
    // const newProductForm: ProductForm = {
    //   details: newProduct.details ?? '',
    //   name: newProduct.name,
    //   id: newProduct.id,
    //   variants: newProduct.variants,
    //   category:
    //     categories.find(
    //       (eachCategory) =>
    //         newProduct?.categoryID &&
    //         eachCategory.id === newProduct.categoryID
    //     ) ?? categories[categories.length - 1],
    // };
    // setProductFormState({
    //   ...defaultProductFormState,
    //   productForm: newProductForm,
    //   // images: newCompoundProduct?.variant?.images,
    //   mode: formMode,
    // });
  }, [
    compoundProduct,
    formMode,
    params.id,
    productForm.id,
    productID,
    setProductFormState,
  ]);

  const isUrlValid = params.id === 'add' || compoundProduct;

  return (
    <CommonPageLayout
      headerProps={{
        showBackIcon: true,
        onBackIconClick: () => {
          navigate(appAbsoluteRoutes.adminProducts);
        },
      }}
    >
      <Box className={isUrlValid ? styles.body : styles.bodyAlt}>
        {isUrlValid ? (
          <>
            <AddEditProductComponent />
            <AddEditProductImagesComponent />
            <AdminProductFormFooterComponent handleReset={handleReset} />
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexGrow: '1',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            Product not found!
          </Box>
        )}
      </Box>
    </CommonPageLayout>
  );
}

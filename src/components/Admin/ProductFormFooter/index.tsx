import * as React from 'react';
import { ReactNode, SyntheticEvent, useCallback } from 'react';
import { AlertColor, Box, LinearProgress } from '@mui/material';
import Button from '@mui/material/Button';

import {
  Product,
  ProductFormModeState,
  ProductFormUploadingState,
  ProductWithoutID,
} from '@/recoil/data/product';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  productFormModeStateSelector,
  productFormProcessingStateSelector,
  productFormSelector,
} from '@/recoil/selectors/productForm';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { useNavigate } from 'react-router-dom';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { categories } from '@/recoil/data/category';
import { appAbsoluteRoutes } from '@/Router';
import SnackbarDialog from '@/components/Dialogs/SnackBar';

interface AdminProductFormFooterComponentProps {
  handleReset: (
    event?:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | SyntheticEvent<Element, Event>
  ) => void;
}

export default function AdminProductFormFooterComponent({
  handleReset,
}: AdminProductFormFooterComponentProps) {
  const formMode = useRecoilValue(productFormModeStateSelector);
  const [processingState, setProcessingState] = useRecoilState(
    productFormProcessingStateSelector
  );
  const productForm = useRecoilValue(productFormSelector);
  const navigate = useNavigate();
  const setDialogComponent = useSetRecoilState(selectedDialogAtom);

  const isProductFormValid = useCallback(() => {
    return !!(
      productForm &&
      productForm.name &&
      ((typeof productForm.mrp === 'number' && productForm.mrp >= 0) ||
        (typeof productForm.mrp === 'string' &&
          !Number.isNaN(
            parseFloat(productForm.mrp) && parseFloat(productForm.mrp) >= 0
          ))) &&
      ((typeof productForm.sp === 'number' && productForm.sp >= 0) ||
        (typeof productForm.sp === 'string' &&
          !Number.isNaN(
            parseFloat(productForm.sp) && parseFloat(productForm.sp) >= 0
          ))) &&
      categories.find(
        (eachCategory) => eachCategory.id === productForm.category.id
      )
    );
  }, [productForm]);

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
      event.preventDefault();
      if (!isProductFormValid()) {
        return;
      }
      if (formMode === ProductFormModeState.read) {
        return;
      }
      let currentProcessingState = ProductFormUploadingState.creatingProduct;
      if (formMode === ProductFormModeState.edit) {
        currentProcessingState = ProductFormUploadingState.updatingProduct;
      }
      setProcessingState({
        ...processingState,
        uploadingState: currentProcessingState,
      });
      const newProduct: ProductWithoutID = {
        name: productForm.name,
        categoryID: productForm.category.id,
        price: {
          timestamp: serverTimestamp(),
          currency: 'INR',
          mrp: productForm.mrp as number,
          sp: productForm.sp as number,
        },
      };
      let message: string = '';
      let severity: AlertColor = 'success';
      let productID = '';
      try {
        if (productForm.id === null) {
          const res = await addDoc(
            collection(appFirestore, 'products'),
            newProduct
          );
          message = `Successfully created ${newProduct.name} with ID ${res.id}`;
          productID = res.id;
        } else {
          const updateProduct: Product = { ...newProduct, id: productForm.id };
          const productRef = doc(appFirestore, 'products', productForm.id);
          await setDoc(productRef, updateProduct);
          message = `Successfully updated ${newProduct.name} with ID ${productForm.id}`;
          productID = productForm.id;
        }
        navigate(`${appAbsoluteRoutes.adminProducts}/${productID}`);
      } catch (_) {
        if (productForm.id !== null) {
          message = `Failed to update ${productForm.name} with ID ${productForm.id}`;
        } else {
          message = 'Failed to create new Product';
        }
        severity = 'error';
      } finally {
        currentProcessingState = ProductFormUploadingState.idle;
        setProcessingState({
          ...processingState,
          uploadingState: currentProcessingState,
          uploadProgress: 0,
        });
        setDialogComponent(
          <SnackbarDialog severity={severity} message={message} />
        );
      }
    },
    [
      formMode,
      isProductFormValid,
      navigate,
      processingState,
      productForm.category.id,
      productForm.id,
      productForm.mrp,
      productForm.name,
      productForm.sp,
      setDialogComponent,
      setProcessingState,
    ]
  );

  const handleDeleteProduct = useCallback(async () => {
    if (productForm.id !== null) {
      setProcessingState({
        uploadingState: ProductFormUploadingState.deletingProduct,
        uploadProgress: 0,
      });
      try {
        await deleteDoc(doc(appFirestore, 'products', productForm.id));
        setDialogComponent(
          <SnackbarDialog
            severity="success"
            message={`successfully deleted product with id ${productForm.id}`}
          />
        );
      } catch (e) {
        setDialogComponent(
          <SnackbarDialog
            severity="error"
            message={
              e instanceof Error
                ? e.message
                : `Failed to deleted product with id ${productForm.id}`
            }
          />
        );
      } finally {
        setProcessingState({
          uploadingState: ProductFormUploadingState.idle,
          uploadProgress: 0,
        });
      }
      setProcessingState(processingState);
    }
  }, [processingState, productForm.id, setDialogComponent, setProcessingState]);

  const disableForm =
    processingState.uploadingState !== ProductFormUploadingState.idle ||
    formMode === ProductFormModeState.read;
  let uploadImagesButton: ReactNode;
  let deleteProductButton: ReactNode;
  // If product is not new
  if (productForm.id !== null) {
    uploadImagesButton = (
      <Button
        sx={{ marginBottom: '16px' }}
        variant="contained"
        disabled={disableForm}
      >
        Upload Images
      </Button>
    );
    deleteProductButton = (
      <Button
        sx={{ marginBottom: '16px' }}
        variant="contained"
        disabled={disableForm}
        onClick={handleDeleteProduct}
      >
        Delete Product
      </Button>
    );
  }
  const commonButtons = (
    <>
      {uploadImagesButton}
      <Button
        sx={{ marginBottom: '16px' }}
        variant="contained"
        onClick={handleReset}
        disabled={disableForm}
      >
        Reset
      </Button>
      {deleteProductButton}
      <Button
        sx={{ marginBottom: '16px' }}
        disabled={!isProductFormValid() || disableForm}
        variant="contained"
        type="button"
        onClick={handleFormSubmit}
      >
        Submit
      </Button>
    </>
  );
  let uploadProgressContainer: ReactNode;
  if (processingState.uploadingState !== ProductFormUploadingState.idle) {
    let progressBar: ReactNode;
    let message: string | null = null;
    // @ts-ignore
    switch (processingState.uploadingState) {
      // @ts-ignore
      case ProductFormUploadingState.creatingProduct:
        message = 'Creating New Product';
      // @ts-ignore
      // eslint-disable-next-line no-fallthrough
      case ProductFormUploadingState.updatingProduct:
        if (message === null) {
          message = `Updating Product ${productForm.name} with ID ${productForm.id}`;
        }
      // eslint-disable-next-line no-fallthrough
      case ProductFormUploadingState.deletingProduct:
        if (message === null) {
          message = `Deleting Product ${productForm.name} with ID ${productForm.id}`;
        }
        progressBar = (
          <Box>
            <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
            <Box>{message}</Box>
          </Box>
        );
        break;
      default:
        break;
    }
    if (progressBar) {
      uploadProgressContainer = (
        <Box
          sx={{
            width: '100%',
            height: '50px',
            padding: '8px',
            backgroundColor: 'white',
            marginBottom: '16px',
          }}
        >
          {progressBar}
        </Box>
      );
    }
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          padding: '0 16px',
          marginBottom: '32px',
        }}
      >
        {commonButtons}
      </Box>
      {uploadProgressContainer}
    </>
  );
}

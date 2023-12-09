import * as React from 'react';
import {
  ChangeEvent,
  createContext,
  PropsWithChildren,
  useCallback,
  useMemo,
} from 'react';
import { Category } from '@/recoil/data/category';
import {
  Product,
  ProductFormModeState,
  ProductFormUploadingState,
  ProductWithoutID,
} from '@/recoil/data/product';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from '@firebase/firestore';
import { AlertColor } from '@mui/material';
import { appFirestore } from '@/firebase';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  productFormModeStateSelector,
  productFormProcessingStateSelector,
  productFormSelector,
} from '@/recoil/selectors/productForm';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { useNavigate } from 'react-router-dom';
import { appAbsoluteRoutes } from '@/Router';
import SnackbarDialog from '@/components/Dialogs/SnackBar';

export interface ProductFormManager {
  handleFieldChange: (
    property: 'name' | 'details' | 'mrp' | 'sp'
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  handleCategoryChange: (category: Category) => void;
  handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isProductFormValid: () => boolean;
}

const defaultProductManagerInstance: ProductFormManager = {
  handleFieldChange:
    (_property: 'name' | 'details' | 'mrp' | 'sp') =>
    (_e: ChangeEvent<HTMLInputElement>) => {},
  handleCategoryChange: (_category: Category) => {},
  handleFormSubmit: (_event: React.FormEvent<HTMLFormElement>) => {},
  isProductFormValid: () => false,
};
export const ProductFormManagerContext = createContext<ProductFormManager>(
  defaultProductManagerInstance
);

export function ProductFormManagerProvider({ children }: PropsWithChildren) {
  const [productForm, setProductForm] = useRecoilState(productFormSelector);
  const formMode = useRecoilValue(productFormModeStateSelector);
  const [processingState, setProcessingState] = useRecoilState(
    productFormProcessingStateSelector
  );
  const setDialogComponent = useSetRecoilState(selectedDialogAtom);
  const navigate = useNavigate();

  const isProductFormValid = useCallback(() => {
    return !!(
      productForm &&
      productForm.name &&
      productForm.mrp &&
      productForm.sp &&
      productForm.details
    );
  }, [productForm]);

  const handleFieldChange = useCallback(
    (property: 'name' | 'details' | 'mrp' | 'sp') =>
      (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        let numVal: number | string = parseFloat(val);
        if (Number.isNaN(numVal)) {
          numVal = '';
        }
        if (typeof numVal === 'number') {
          if (numVal < 0) {
            numVal = 0;
          }
        }
        switch (property) {
          case 'name':
            setProductForm({ ...productForm, name: val });
            break;
          case 'details':
            setProductForm({ ...productForm, details: val });
            break;
          case 'mrp':
            setProductForm({ ...productForm, mrp: numVal });
            break;
          case 'sp':
            setProductForm({ ...productForm, sp: numVal });
            break;
          default:
            break;
        }
      },
    [productForm, setProductForm]
  );
  const handleCategoryChange = useCallback(
    (category: Category) => {
      setProductForm({ ...productForm, category });
    },
    [productForm, setProductForm]
  );

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
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

  const formManagerValue = useMemo(
    (): ProductFormManager => ({
      handleFormSubmit,
      handleCategoryChange,
      handleFieldChange,
      isProductFormValid,
    }),
    [
      handleCategoryChange,
      handleFieldChange,
      handleFormSubmit,
      isProductFormValid,
    ]
  );

  return (
    <ProductFormManagerContext.Provider value={formManagerValue}>
      {children}
    </ProductFormManagerContext.Provider>
  );
}

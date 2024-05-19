import { atom } from 'jotai';
import {
  ProductForm,
  ProductFormModeState,
  ProductFormState,
} from '@/jotai/data/product';
import { categories } from '@/jotai/data/category';

export const defaultProductForm: ProductForm = {
  id: null,
  details: '',
  category: categories[categories.length - 1],
  name: '',
  variants: [],
};
export const defaultProductFormProcessingState = false;

export const defaultProductFormMode = ProductFormModeState.read;
export const defaultProductFormState: ProductFormState = {
  productForm: defaultProductForm,
  isProcessing: defaultProductFormProcessingState,
  mode: defaultProductFormMode,
};
export const productFormStateAtom = atom<ProductFormState>(
  defaultProductFormState
);

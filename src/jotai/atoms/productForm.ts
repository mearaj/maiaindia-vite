import { atom } from 'jotai';
import { ProductFormModeState, ProductFormState } from '@/jotai/data/product';
import { categories } from '@/jotai/data/category';

export const defaultProductForm = {
  id: null,
  mrp: '',
  sp: '',
  details: '',
  category: categories[categories.length - 1],
  name: '',
};
export const defaultProductFormProcessingState = false;

export const defaultProductFormMode = ProductFormModeState.read;
export const defaultProductFormState: ProductFormState = {
  productForm: defaultProductForm,
  isProcessing: defaultProductFormProcessingState,
  mode: defaultProductFormMode,
  images: [],
  localImages: [],
  imagesForDeletion: [],
};
export const productFormStateAtom = atom<ProductFormState>(
  defaultProductFormState
);

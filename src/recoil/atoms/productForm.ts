import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { ProductFormModeState, ProductFormState } from '@/recoil/data/product';
import { categories } from '@/recoil/data/category';

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
};
export const productFormStateAtom = atom<ProductFormState>({
  key: recoilKeys.productFormStateAtom,
  default: defaultProductFormState,
});

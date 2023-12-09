import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import {
  ProductFormModeState,
  ProductFormState,
  ProductFormUploadingState,
} from '@/recoil/data/product';
import { categories } from '@/recoil/data/category';

export const defaultProductForm = {
  id: null,
  mrp: '',
  sp: '',
  details: '',
  category: categories[categories.length - 1],
  name: '',
};
export const defaultProductFormProcessingState = {
  uploadingState: ProductFormUploadingState.idle,
  uploadProgress: 0,
};

export const defaultProductFormMode = ProductFormModeState.read;
export const defaultProductFormState: ProductFormState = {
  productForm: defaultProductForm,
  processingState: defaultProductFormProcessingState,
  mode: defaultProductFormMode,
  images: [],
};
export const productFormStateAtom = atom<ProductFormState>({
  key: recoilKeys.productFormStateAtom,
  default: defaultProductFormState,
});

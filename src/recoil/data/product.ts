import { FieldValue, Timestamp } from '@firebase/firestore';
import { Category } from '@/recoil/data/category';

export interface ProductPrice {
  timestamp: FieldValue | Timestamp;
  currency: string;
  mrp: number;
  sp: number;
}

export interface ProductImage {
  name: string;
  height: number;
  width: number;
  src?: string;
}

export interface ProductImages {
  // value corresponds to img element's src attribute val
  [productID: string]: string[];
}

export interface ProductWithoutID {
  categoryID: string;
  name: string;
  price: ProductPrice;
  priceHistory?: ProductPrice[];
  details?: string;
}

export interface Product extends ProductWithoutID {
  id: string;
}

export interface ProductForm {
  name: string;
  details?: string;
  mrp: number | string;
  sp: number | string;
  category: Category;
  id: string | null;
}

export enum ProductFormUploadingState {
  idle,
  updatingProduct,
  creatingProduct,
  uploadingImagesLocally,
  removingImagesLocally,
  uploadingImagesToBackend,
  removingImagesFromBackend,
}

export interface ProductFormProcessingState {
  uploadingState: ProductFormUploadingState;
  uploadProgress: number;
}

export enum ProductFormModeState {
  read,
  edit,
}

export interface ProductFormState {
  productForm: ProductForm;
  processingState: ProductFormProcessingState;
  mode: ProductFormModeState;
}

import { FieldValue, Timestamp } from '@firebase/firestore';
import { Category } from '@/recoil/data/category';
import placeholderImage from '@/assets/images/placeholder.svg';

export interface ProductImage {
  name: string;
  url: string;
}

export const defaultPlaceholderProductImage = {
  name: 'Placeholder',
  url: placeholderImage,
};

export interface ProductWithoutID {
  categoryID?: string;
  name?: string;
  details?: string;
  updatedAt?: FieldValue | Timestamp;
  createdAt?: FieldValue | Timestamp;
  currency?: string;
  mrp?: number;
  sp?: number;
  images?: ProductImage[];
}

export interface Product extends ProductWithoutID {
  id: string;
}

export interface ProductForm {
  name?: string;
  details?: string;
  mrp?: number | string;
  sp?: number | string;
  category: Category;
  id?: string | null;
}

export enum ProductFormModeState {
  read,
  edit,
}

export interface LocallyUploadedImage {
  file: File;
  url: string;
}

export interface ProductFormState {
  productForm: ProductForm;
  isProcessing: boolean;
  mode: ProductFormModeState;
  images?: ProductImage[];
  imagesForDeletion: ProductImage[];
  localImages: LocallyUploadedImage[];
}

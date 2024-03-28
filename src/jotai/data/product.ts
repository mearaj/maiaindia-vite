import { FieldValue, Timestamp } from '@firebase/firestore';
import { Category } from '@/jotai/data/category';

export interface ProductImage {
  name: string;
  url: string;
}

export const defaultPlaceholderProductImage = {
  name: 'Placeholder',
  url: '/images/placeholder.svg',
};

export interface Product {
  id?: string;
  categoryID: string;
  name: string;
  details: string;
  updatedAt: FieldValue | Timestamp;
  createdAt: FieldValue | Timestamp;
  currency: string;
  mrp: number;
  sp: number;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export interface ProductForm {
  name: string;
  details: string;
  mrp: number | string;
  sp: number | string;
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

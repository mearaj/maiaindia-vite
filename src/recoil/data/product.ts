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
  url: string;
}

export interface ProductsImages {
  [productID: string]: ProductImage[];
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
  images: ProductImage[];
  localImages: LocallyUploadedImage[];
}

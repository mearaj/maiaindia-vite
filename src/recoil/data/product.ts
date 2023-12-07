import { FieldValue, Timestamp } from '@firebase/firestore';
import { categories, Category } from '@/recoil/data/category';

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

export interface AddProductForm {
  name: string;
  details: string;
  image?: {
    url: string;
    height: number;
    width: number;
    extension: string;
    file: File | null;
  };
  mrp: number | string;
  sp: number | string;
  category: Category;
  processingState: 'error' | 'warning' | 'info' | 'success' | 'none';
  processingMsg: string;
  allowDismissAction: boolean;
}

export interface ProductForm {
  name: string;
  details?: string;
  mrp: number | string;
  sp: number | string;
  category: Category;
  id: string | null;
}

export const defaultProductForm: ProductForm = {
  name: '',
  details: '',
  mrp: '',
  sp: '',
  category: categories[categories.length - 1],
  id: null,
};
export const errorUploadingImage = {
  image: undefined,
  processingState: 'error',
  processingMsg: 'Error uploading image locally',
  allowDismissAction: true,
};

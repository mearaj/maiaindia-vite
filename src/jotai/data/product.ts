import { Category } from '@/jotai/data/category';

export interface VariantImage {
  name: string;
  url: string;
}

export const defaultPlaceholderProductImage = {
  name: 'Placeholder',
  url: '/images/placeholder.svg',
};

export interface Product {
  id?: string; // frontend only
  categoryID: string;
  name: string;
  details: string;
  variants: Variant[]; // At least one variant is required
  activeVariant?: Variant; // frontend only
}

export interface Variant {
  productID?: string; // frontend only
  id: string;
  currency: string;
  mrp: number;
  sp: number;
  images?: VariantImage[];
}

// Frontend only
export interface CompoundID {
  productID: string;
  variantID: string;
}

// Frontend only
export interface CompoundProduct {
  product: Product;
  variant: Variant;
}

export interface VariantForm {
  productID?: string;
  id?: string;
  mrp?: number | string;
  sp?: number | string;
  currency?: string;
}

export interface ProductForm {
  name: string;
  details: string;
  category: Category;
  id?: string | null;
  variants: VariantForm[];
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
  images?: VariantImage[];
  imagesForDeletion: VariantImage[];
  localImages: LocallyUploadedImage[];
}

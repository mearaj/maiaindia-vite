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
  images?: VariantImage[]; // frontend only
  imagesForDeletion?: VariantImage[]; // frontend only
  localImages?: LocallyUploadedImage[]; // frontend only
}

// Frontend only
export interface CompoundProduct {
  product: Product;
  variant: Variant;
}

// Frontend only
export interface CompoundID {
  productID: string;
  variantID: string;
}

export interface ProductForm {
  name: string;
  details: string;
  category: Category;
  id?: string | null;
  variants: Variant[];
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
  isNew: boolean;
}

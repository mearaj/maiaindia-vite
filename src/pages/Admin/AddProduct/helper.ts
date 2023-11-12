import { Category } from '@/firebase/category';

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

export const errorUploadingImage = {
  image: undefined,
  processingState: 'error',
  processingMsg: 'Error uploading image locally',
  allowDismissAction: true,
};

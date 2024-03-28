import { productFormStateAtom } from '@/jotai/atoms/productForm';
import { atom } from 'jotai';
import {
  LocallyUploadedImage,
  ProductForm,
  ProductFormModeState,
  ProductImage,
} from '@/jotai/data/product';

export const productFormSelector = atom(
  (get) => {
    const { productForm } = get(productFormStateAtom);
    return productForm;
  },
  (_, set, newVal: ProductForm) => {
    set(productFormStateAtom, (prev) => {
      return {
        ...prev,
        productForm: newVal,
      };
    });
  }
);

export const productFormProcessingStateSelector = atom(
  (get) => {
    const { isProcessing } = get(productFormStateAtom);
    return isProcessing;
  },
  (_, set, newVal: boolean) => {
    set(productFormStateAtom, (prev) => {
      return {
        ...prev,
        isProcessing: newVal,
      };
    });
  }
);

export const productFormModeStateSelector = atom(
  (get) => {
    const { mode } = get(productFormStateAtom);
    return mode;
  },
  (_, set, newVal: ProductFormModeState) => {
    set(productFormStateAtom, (prev) => {
      return {
        ...prev,
        mode: newVal,
      };
    });
  }
);

export const productFormImagesSelector = atom(
  (get) => {
    const { images } = get(productFormStateAtom);
    return images;
  },
  (_, set, newVal: []) => {
    set(productFormStateAtom, (prev) => {
      return {
        ...prev,
        images: newVal,
      };
    });
  }
);

export const productFormLocalImagesSelector = atom(
  (get) => {
    const { localImages } = get(productFormStateAtom);
    return localImages;
  },
  (_, set, newVal: LocallyUploadedImage[]) => {
    set(productFormStateAtom, (prev) => {
      return {
        ...prev,
        localImages: newVal,
      };
    });
  }
);

export const productFormImagesForDeletionSelector = atom(
  (get) => {
    const { imagesForDeletion } = get(productFormStateAtom);
    return imagesForDeletion;
  },
  (_, set, newVal: ProductImage[]) => {
    set(productFormStateAtom, (prev) => {
      return {
        ...prev,
        imagesForDeletion: newVal,
      };
    });
  }
);

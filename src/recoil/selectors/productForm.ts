import { DefaultValue, selector } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { productFormStateAtom } from '@/recoil/atoms/productForm';

export const productFormSelector = selector({
  key: recoilKeys.productFormSelector,
  get: ({ get }) => {
    const { productForm } = get(productFormStateAtom);
    return productForm;
  },
  set: ({ set, get }, newValue) => {
    const productFormState = get(productFormStateAtom);
    if (!(newValue instanceof DefaultValue)) {
      set(productFormStateAtom, {
        ...productFormState,
        productForm: { ...newValue },
      });
    }
  },
});
export const productFormProcessingStateSelector = selector({
  key: recoilKeys.productFormProcessingStateSelector,
  get: ({ get }) => {
    const { isProcessing } = get(productFormStateAtom);
    return isProcessing;
  },
  set: ({ set, get }, isProcessing) => {
    const productFormState = get(productFormStateAtom);
    if (!(isProcessing instanceof DefaultValue)) {
      set(productFormStateAtom, {
        ...productFormState,
        isProcessing,
      });
    }
  },
});
export const productFormModeStateSelector = selector({
  key: recoilKeys.productFormModeStateSelector,
  get: ({ get }) => {
    const { mode } = get(productFormStateAtom);
    return mode;
  },
  set: ({ set, get }, newValue) => {
    const productFormState = get(productFormStateAtom);
    if (!(newValue instanceof DefaultValue)) {
      set(productFormStateAtom, {
        ...productFormState,
        mode: newValue,
      });
    }
  },
});
export const productFormImagesSelector = selector({
  key: recoilKeys.productFormImagesSelector,
  get: ({ get }) => {
    const { images } = get(productFormStateAtom);
    return images;
  },
  set: ({ set, get }, newValue) => {
    const productFormState = get(productFormStateAtom);
    if (!(newValue instanceof DefaultValue)) {
      set(productFormStateAtom, {
        ...productFormState,
        images: newValue,
      });
    }
  },
});

export const productFormLocalImagesSelector = selector({
  key: recoilKeys.productFormLocalImagesSelector,
  get: ({ get }) => {
    const { localImages } = get(productFormStateAtom);
    return localImages;
  },
  set: ({ set, get }, newValue) => {
    const productFormState = get(productFormStateAtom);
    if (!(newValue instanceof DefaultValue)) {
      set(productFormStateAtom, {
        ...productFormState,
        localImages: newValue,
      });
    }
  },
});

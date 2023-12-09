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
    const { processingState } = get(productFormStateAtom);
    return processingState;
  },
  set: ({ set, get }, newValue) => {
    const productFormState = get(productFormStateAtom);
    if (!(newValue instanceof DefaultValue)) {
      set(productFormStateAtom, {
        ...productFormState,
        processingState: { ...newValue },
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

import { atom } from 'jotai';
import {
  defaultProductFormState,
  ProductFormState,
} from '@/jotai/data/product';

export const productFormStateAtom = atom<ProductFormState>(
  defaultProductFormState
);

import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { Category, defaultSelectedCategory } from '@/firebase/category';

export const categoryAtom = atom<Category>({
  key: recoilKeys.categoryAtom,
  default: defaultSelectedCategory,
});

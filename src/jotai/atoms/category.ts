import { atom } from 'jotai';
import { Category, defaultSelectedCategory } from '@/jotai/data/category';

export const categoryAtom = atom<Category>(defaultSelectedCategory);

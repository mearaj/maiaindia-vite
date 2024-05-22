import { categoryAtom } from '@/jotai/atoms/index';
import { defaultSelectedCategory } from '@/jotai/data/category';
import { atom } from 'jotai';
import { Product } from '@/jotai/data/product';

export const allProductsAtom = atom<Product[]>([]);

export const productsByCategory = atom((get) => {
  const selectedCategory = get(categoryAtom);
  if (selectedCategory.id === defaultSelectedCategory.id) {
    return get(allProductsAtom);
  }
  return get(allProductsAtom).filter(
    (eachProduct) => eachProduct.categoryID === selectedCategory.id
  );
});

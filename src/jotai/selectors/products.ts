import { categoryAtom } from '@/jotai/atoms';
import { defaultSelectedCategory } from '@/jotai/data/category';
import { allProductsAtom } from '@/jotai/atoms/allProducts';
import { atom } from 'jotai';

export const productsSelector = atom(async (get) => {
  const selectedCategory = get(categoryAtom);
  if (selectedCategory.id === defaultSelectedCategory.id) {
    return get(allProductsAtom);
  }
  return (await get(allProductsAtom)).filter(
    (eachProduct) => eachProduct.categoryID === selectedCategory.id
  );
});

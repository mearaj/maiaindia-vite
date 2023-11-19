import { selector } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { categoryAtom } from '@/recoil/atoms';
import { defaultSelectedCategory } from '@/firebase/category';
import { allProductsAtom } from '@/recoil/atoms/allProducts';

export const productsSelector = selector({
  key: recoilKeys.productsSelector,
  get: ({ get }) => {
    const selectedCategory = get(categoryAtom);
    if (selectedCategory.id === defaultSelectedCategory.id) {
      return get(allProductsAtom);
    }
    return get(allProductsAtom).filter(
      (eachProduct) => eachProduct.categoryID === selectedCategory.id
    );
  },
});

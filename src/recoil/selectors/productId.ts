import { selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { allProductsAtom } from '@/recoil/atoms/allProducts';

export const productIdSelector = selectorFamily({
  key: recoilKeys.productIdSelector,
  get:
    (productID: string) =>
    async ({ get }) => {
      const found = get(allProductsAtom).find(
        (eachProduct) => eachProduct.id === productID
      );
      if (!found) {
        throw Error('Product not found');
      }
      return found;
    },
});

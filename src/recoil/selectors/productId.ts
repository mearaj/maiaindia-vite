import { selector, selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { activeProductIdAtom } from '@/recoil/atoms/product';
import { getProductByID, Product } from '@/firebase/product';

export const activeProductIdSelector = selector({
  key: recoilKeys.activeProductIdSelector,
  get: async ({ get }) => {
    const productID = get(activeProductIdAtom);
    if (productID === '') {
      return { data: undefined, error: 'Product not found' };
    }
    return getProductByID(productID);
  },
});

export const productIdSelector = selectorFamily({
  key: recoilKeys.productIdSelector,
  get:
    (productID: string) =>
    async (): Promise<{
      data: Product | undefined;
      error: String;
    }> => {
      return getProductByID(productID);
    },
});

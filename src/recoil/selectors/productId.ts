import { selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { allProductsAtom } from '@/recoil/atoms/allProducts';
import { appFirestore } from '@/firebase';
import { doc, getDoc } from '@firebase/firestore';
import { Product } from '@/recoil/data/product';

export const productIdSelector = selectorFamily({
  key: recoilKeys.productIdSelector,
  get:
    (productID: string) =>
    async ({ get }) => {
      const found = get(allProductsAtom).find(
        (eachProduct) => eachProduct.id === productID
      );
      if (!found) {
        const docRef = doc(appFirestore, 'products', productID);
        const docSnapshot = await getDoc(docRef);
        if (!docSnapshot.exists()) {
          throw Error('Product not found');
        }
        return { ...docSnapshot.data(), id: docSnapshot.id } as Product;
      }
      return found;
    },
});

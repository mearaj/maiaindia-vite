import { selector } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { productIdAtom } from '@/recoil/atoms/product';
import { doc, getDoc } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { FirebaseError } from '@firebase/util';
import { Product } from '@/recoil/data/product';

export const productIdSelector = selector({
  key: recoilKeys.productIdSelector,
  get: async ({ get }) => {
    try {
      const productID = get(productIdAtom);
      if (productID === '') {
        return { data: undefined, error: 'Product not found' };
      }
      const productRef = doc(appFirestore, 'products', productID);
      const docSnap = await getDoc(productRef);
      if (!docSnap.exists()) {
        return { data: undefined, error: 'Product not found' };
      }
      const product = docSnap.data() as Product;
      product.id = docSnap.id;
      return { data: product, error: '' };
    } catch (e) {
      if (e instanceof FirebaseError) {
        return { data: undefined, error: e.code };
      }
      if (e instanceof Error) {
        return { data: undefined, error: e.message };
      }
      return { data: undefined, error: 'An unknown error has occurred' };
    }
  },
});

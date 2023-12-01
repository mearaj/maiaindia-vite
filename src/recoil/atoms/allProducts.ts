import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { Product } from '@/recoil/data/product';
import { collection, onSnapshot, query } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { updateDocsSnapshots } from '@/misc';

export const allProductsAtom = atom<Product[]>({
  key: recoilKeys.allProductsAtom,
  default: [],
  effects: [
    ({ setSelf, getPromise, node }) => {
      const allProductsQuery = query(collection(appFirestore, 'products'));
      return onSnapshot(allProductsQuery, async (productsSnapShot) => {
        let products: Product[] = [...(await getPromise(node))];
        products = updateDocsSnapshots(productsSnapShot, products);
        setSelf(products);
      });
    },
  ],
});

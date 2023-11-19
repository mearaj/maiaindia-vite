import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { Product } from '@/firebase/product';
import { collection, onSnapshot, query } from '@firebase/firestore';
import { appFirestore } from '@/firebase';

export const allProductsAtom = atom<Product[]>({
  key: recoilKeys.allProductsAtom,
  default: [],
  effects: [
    ({ setSelf }) => {
      const allProductsQuery = query(collection(appFirestore, 'products'));
      return onSnapshot(allProductsQuery, (productsSnapShot) => {
        const products: Product[] = [];
        productsSnapShot.forEach((product) => {
          products.push({
            id: product.id,
            name: (product.data() as unknown as Product).name,
            images: (product.data() as unknown as Product).images,
            categoryID: (product.data() as unknown as Product).categoryID,
            price: (product.data() as unknown as Product).price,
          });
        });
        setSelf(products);
      });
    },
  ],
});

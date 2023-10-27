import { selector } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import {
  collection,
  DocumentData,
  getDocs,
  query,
  Query,
  where,
} from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { categoryAtom } from '@/recoil/atoms';
import { categories } from '@/recoil/data/category';
import { Product } from '@/recoil/data/product';
import { FirebaseError } from '@firebase/util';

export const productsSelector = selector({
  key: recoilKeys.productsSelector,
  get: async ({ get }) => {
    try {
      const productsRef = collection(appFirestore, 'products');
      let productsQuery: Query<DocumentData, DocumentData>;
      const selectedCategory = get(categoryAtom);
      const found = categories.find(
        (eachCategory) => eachCategory.id === selectedCategory.id
      );
      if (!found) {
        productsQuery = query(productsRef);
      } else {
        productsQuery = query(
          productsRef,
          where('categoryID', '==', selectedCategory.id ?? '')
        );
      }
      const productsSnapShot = await getDocs(productsQuery);
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
      return { data: products, error: '' };
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

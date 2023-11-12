import { selector } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import {
  collection,
  DocumentData,
  query,
  Query,
  where,
} from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { categoryAtom } from '@/recoil/atoms';
import { categories } from '@/firebase/category';
import { getProducts } from '@/firebase/products';

export const productsSelector = selector({
  key: recoilKeys.productsSelector,
  get: async ({ get }) => {
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
    return getProducts(productsQuery);
  },
});

import { atom } from 'jotai';
import { Product } from '@/jotai/data/product';
import { collection, onSnapshot, query } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { atomEffect } from 'jotai-effect';

export const allProductsAtom = atom<Product[]>([]);

export const allProductsAtomEffect = atomEffect((get, set) => {
  const allProductsQuery = query(collection(appFirestore, 'products'));
  return onSnapshot(allProductsQuery, async (productsSnapShot) => {
    const products: Product[] = [...get(allProductsAtom)];
    for await (const change of productsSnapShot.docChanges()) {
      const { id } = change.doc;
      const foundIndex = products.findIndex((docItem) => docItem.id === id);
      const productToAddModify = {
        ...change.doc.data(),
        id,
      } as Product;
      let updateRequired = false;
      switch (change.type) {
        case 'added':
        case 'modified':
          updateRequired = true;
        case 'removed': {
          if (foundIndex >= 0) {
            products.splice(foundIndex, 1);
          }
        }
        default:
          break;
      }
      if (updateRequired) {
        if (foundIndex >= 0) {
          products[foundIndex] = productToAddModify;
        } else {
          products.unshift(productToAddModify);
        }
      }
    }
    set(allProductsAtom, products);
  });
});

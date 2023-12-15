import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { Product } from '@/recoil/data/product';
import { collection, getDocs, onSnapshot, query } from '@firebase/firestore';
import { appFirestore } from '@/firebase';

export const allProductsAtom = atom<Product[]>({
  key: recoilKeys.allProductsAtom,
  default: new Promise((r) => {
    const getAllProductsAsync = async () => {
      const allProductsQuery = query(collection(appFirestore, 'products'));
      const products: Product[] = [];
      const querySnapShot = await getDocs(allProductsQuery);
      for await (const doc of querySnapShot.docs) {
        const product: Product = { ...doc.data(), id: doc.id } as Product;
        products.push(product);
      }
      r(products);
    };
    getAllProductsAsync();
  }),
  effects: [
    ({ setSelf, getPromise, node }) => {
      const allProductsQuery = query(collection(appFirestore, 'products'));
      return onSnapshot(allProductsQuery, async (productsSnapShot) => {
        const products: Product[] = [...(await getPromise(node))];
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
        setSelf(products);
      });
    },
  ],
});

import { atom, selector } from 'recoil';
import { categories, Category, Product } from '@/data/store';
import {
  collection,
  DocumentData,
  getDocs,
  query,
  Query,
  where,
} from '@firebase/firestore';
import { appFirestore } from '@/firebase';

export const recoilKeys = {
  menuAtom: 'menuAtom',
  categoryAtom: 'categoryAtom',
  productsSelector: 'productsSelector',
};

export const menuAtom = atom({
  key: recoilKeys.menuAtom,
  default: false,
});

export const defaultSelectedCategory = { name: 'All', id: 'All' };
export const categoryAtom = atom<Category>({
  key: recoilKeys.categoryAtom,
  default: defaultSelectedCategory,
});

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
    // catch (e: unknown) {
    //       if (e instanceof FirebaseError) {
    //         return { error: e.code };
    //       }
    //       if (e as any) {
    //         return { error: (e as any).toString() };
    //       }
    //       return { error: e };
    //     }
    //   },
    return products as Product[];
  },
});

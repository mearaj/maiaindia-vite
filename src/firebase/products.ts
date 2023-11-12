import { getDocs, Query } from '@firebase/firestore';
import { FirebaseError } from '@firebase/util';
import { Product } from '@/firebase/product';

export const getProducts = async (
  productsQuery: Query
): Promise<{ data: Product[]; error: string }> => {
  try {
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
      return { data: [], error: e.code };
    }
    if (e instanceof Error) {
      return { data: [], error: e.message };
    }
    return { data: [], error: 'An unknown error has occurred' };
  }
};

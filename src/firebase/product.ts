import { doc, FieldValue, getDoc, Timestamp } from '@firebase/firestore';
import { FirebaseError } from '@firebase/util';
import { appFirestore } from '@/firebase/index';

export interface ProductPrice {
  timestamp: FieldValue | Timestamp;
  currency: string;
  mrp: number;
  sp: number;
}

export interface ProductImage {
  name: string;
  height: number;
  width: number;
  src?: string;
}

export interface ProductWithoutID {
  categoryID: string;
  images?: ProductImage[];
  name: string;
  price: ProductPrice;
  priceHistory?: ProductPrice[];
}

export interface Product extends ProductWithoutID {
  id: string;
}

export const getProductByID = async (
  productID: string
): Promise<{ data: Product | undefined; error: string }> => {
  try {
    if (productID === '') {
      return { data: undefined, error: 'Product id cannot be empty!' };
    }
    const productRef = doc(appFirestore, 'products', productID);
    const docSnap = await getDoc(productRef);
    if (!docSnap.exists()) {
      return { data: undefined, error: 'Product not found!' };
    }
    const product = docSnap.data() as Product;
    return { data: { ...product, id: docSnap.id }, error: '' };
  } catch (e) {
    if (e instanceof FirebaseError) {
      return { data: undefined, error: e.code };
    }
    if (e instanceof Error) {
      return { data: undefined, error: e.message };
    }
    return { data: undefined, error: 'An unknown error has occurred' };
  }
};

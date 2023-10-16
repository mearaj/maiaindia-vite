import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { doc, DocumentData, getDoc, getDocs, Query } from '@firebase/firestore';
import { FirebaseError } from '@firebase/util';
import { Product } from '@/store/data/data';
import { appFirestore } from '@/config/firebase';

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], Query<DocumentData, DocumentData>>({
      async queryFn(query) {
        try {
          const productsSnapShot = await getDocs(query);
          const products: Product[] = [];
          productsSnapShot.forEach((product) => {
            products.push({
              id: product.id,
              name: (product.data() as unknown as Product).name,
              images: (product.data() as unknown as Product).images,
              categoryID: (product.data() as unknown as Product).categoryID,
            });
          });
          return { data: products };
        } catch (e: unknown) {
          if (e instanceof FirebaseError) {
            return { error: e.code };
          }
          if (e as any) {
            return { error: (e as any).toString() };
          }
          return { error: e };
        }
      },
    }),
    getProduct: builder.query<Product, string>({
      async queryFn(productID) {
        try {
          const productRef = doc(appFirestore, 'products', productID);
          const docSnap = await getDoc(productRef);
          if (!docSnap.exists()) {
            return { error: 'No such document' };
          }
          const data = docSnap.data() as Product;
          data.id = productID;
          return { data };
        } catch (e: unknown) {
          if (e instanceof FirebaseError) {
            return { error: e.code };
          }
          if (e as any) {
            return { error: (e as any).toString() };
          }
          return { error: e };
        }
      },
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = apiSlice;
export { apiSlice };

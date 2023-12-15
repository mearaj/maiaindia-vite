import { selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { allProductsAtom } from '@/recoil/atoms/allProducts';
import { appFirebaseStorage, appFirestore } from '@/firebase';
import { doc, getDoc } from '@firebase/firestore';
import { Product } from '@/recoil/data/product';
import { getDownloadURL, listAll, ref } from '@firebase/storage';

export const productIdSelector = selectorFamily({
  key: recoilKeys.productIdSelector,
  get:
    (productID: string) =>
    async ({ get }) => {
      const found = get(allProductsAtom).find(
        (eachProduct) => eachProduct.id === productID
      );
      if (!found) {
        const docRef = doc(appFirestore, 'products', productID);
        const docSnapshot = await getDoc(docRef);
        if (!docSnapshot.exists()) {
          throw Error('Product not found');
        }
        const productToAddModify = {
          ...docSnapshot.data(),
          id: docSnapshot.id,
        } as Product;
        const imagesRef = ref(appFirebaseStorage, `products/${productID}`);
        const allListRef = await listAll(imagesRef);
        productToAddModify.images = [];
        for await (const eachImageRef of allListRef.items) {
          const imageURL = await getDownloadURL(eachImageRef);
          productToAddModify.images.push({
            url: imageURL,
            name: eachImageRef.name,
          });
        }
        return productToAddModify;
      }
      return found;
    },
});

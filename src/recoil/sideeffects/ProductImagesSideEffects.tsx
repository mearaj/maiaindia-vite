import { useEffect } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import {
  allProductsAtom,
  allProductsImagesAtom,
} from '@/recoil/atoms/allProducts';
import { getDownloadURL, listAll, ref } from '@firebase/storage';
import { appFirebaseStorage } from '@/firebase';
import { ProductImages } from '@/recoil/data/product';

export default function ProductImagesSideEffects() {
  const allProducts = useRecoilValue(allProductsAtom);

  const updateProductsImages = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const currentAllProducts = await snapshot.getPromise(allProductsAtom);
        const allProductImages: ProductImages = {};
        for await (const product of currentAllProducts) {
          const imagesRef = ref(appFirebaseStorage, `products/${product.id}`);
          allProductImages[product.id] = [];
          const allListRef = await listAll(imagesRef);
          for await (const eachImageRef of allListRef.items) {
            const imageURL = await getDownloadURL(eachImageRef);
            allProductImages[product.id].push({
              url: imageURL,
              name: eachImageRef.name,
            });
          }
        }
        set(allProductsImagesAtom, allProductImages);
      },
    []
  );

  useEffect(() => {
    updateProductsImages();
  }, [allProducts, updateProductsImages]);

  return null;
}

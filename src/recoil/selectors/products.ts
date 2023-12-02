import { selector, selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { categoryAtom } from '@/recoil/atoms';
import { defaultSelectedCategory } from '@/recoil/data/category';
import {
  allProductsAtom,
  allProductsImagesAtom,
} from '@/recoil/atoms/allProducts';
import { appFirebaseStorage } from '@/firebase';
import { getDownloadURL, listAll, ref } from '@firebase/storage';
import imagePlaceholder from '@/assets/images/placeholder.svg';

export const productsSelector = selector({
  key: recoilKeys.productsSelector,
  get: ({ get }) => {
    const selectedCategory = get(categoryAtom);
    if (selectedCategory.id === defaultSelectedCategory.id) {
      return get(allProductsAtom);
    }
    return get(allProductsAtom).filter(
      (eachProduct) => eachProduct.categoryID === selectedCategory.id
    );
  },
});
export const imagesByProductIDSelector = selectorFamily({
  key: recoilKeys.imagesByProductIDSelector,
  get:
    (productID: string) =>
    async ({ get }) => {
      const allProductImages = get(allProductsImagesAtom);
      let imagesURLs = allProductImages[productID];
      if (!imagesURLs || imagesURLs.length === 0) {
        imagesURLs = [];
        const imagesRef = ref(appFirebaseStorage, `products/${productID}`);
        const allListRef = await listAll(imagesRef);
        for await (const eachImageRef of allListRef.items) {
          const imageURL = await getDownloadURL(eachImageRef);
          imagesURLs.push(imageURL);
        }
      }
      if (imagesURLs.length === 0) {
        return [imagePlaceholder];
      }
      return imagesURLs;
    },
});

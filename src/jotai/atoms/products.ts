import { categoryAtom } from '@/jotai/atoms/index';
import { defaultSelectedCategory } from '@/jotai/data/category';
import { atom } from 'jotai';
import { CompoundProduct, Product, VariantImage } from '@/jotai/data/product';
import { atomEffect } from 'jotai-effect';
import { collection, onSnapshot, query } from '@firebase/firestore';
import { appFirebaseStorage, appFirestore } from '@/firebase';
import { atomFamily } from 'jotai/utils';
import { getBlob, listAll, ref } from '@firebase/storage';

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
        if (!productToAddModify.activeVariant) {
          productToAddModify.activeVariant = {
            ...productToAddModify.variants[0],
          };
        }
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

export const productsByCategory = atom((get) => {
  const selectedCategory = get(categoryAtom);
  if (selectedCategory.id === defaultSelectedCategory.id) {
    return get(allProductsAtom);
  }
  return get(allProductsAtom).filter(
    (eachProduct) => eachProduct.categoryID === selectedCategory.id
  );
});

export const compoundProductWithImagesSelector = atomFamily(
  (productIDVariantID: string) => {
    return atom(async (get) => {
      const allProducts = get(allProductsAtom);
      let foundProductWithVariant: CompoundProduct | undefined;
      let foundProductIndex: number | undefined;
      let foundVariantIndex: number | undefined;
      for (const [productIndex, product] of allProducts.entries()) {
        let shouldBreak = false;
        for (const [variantIndex, variant] of product.variants.entries()) {
          const compoundID = `${product.id}-${variant.id}`;
          if (productIDVariantID === compoundID) {
            foundProductWithVariant = { product, variant };
            foundProductIndex = productIndex;
            foundVariantIndex = variantIndex;
            shouldBreak = true;
            break;
          }
        }
        if (shouldBreak) {
          break;
        }
      }
      if (!foundProductWithVariant) {
        throw Error('Product not found');
      }
      if (
        !foundProductWithVariant.variant.images ||
        !foundProductWithVariant.variant.images.length
      ) {
        const pathRef = ref(
          appFirebaseStorage,
          `products/${foundProductWithVariant.product.id}/variants/${foundProductWithVariant.variant.id}`
        );
        try {
          const imagesList = await listAll(pathRef);
          const images: VariantImage[] = [];
          for await (const eachImage of imagesList.items) {
            // const url = await getDownloadURL(eachImage);
            const url = await getBlob(eachImage);
            images.push({
              name: eachImage.name,
              url: URL.createObjectURL(url),
            });
          }
          allProducts[foundProductIndex!].variants[foundVariantIndex!].images =
            images;
        } catch (e) {
          allProducts[foundProductIndex!].variants[foundVariantIndex!].images =
            [];
        }
        atomEffect((_, set) => {
          set(allProductsAtom, allProducts);
        });
      }

      return foundProductWithVariant;
    });
  }
);
export const compoundProductSelector = atomFamily(
  (productIDVariantID: string) => {
    return atom((get) => {
      const allProducts = get(allProductsAtom);
      let foundProductWithVariant: CompoundProduct | undefined;
      for (const product of allProducts) {
        let shouldBreak = false;
        for (const variant of product.variants) {
          const compoundID = `${product.id}-${variant.id}`;
          if (productIDVariantID === compoundID) {
            foundProductWithVariant = { product, variant };
            shouldBreak = true;
            break;
          }
        }
        if (shouldBreak) {
          break;
        }
      }
      return foundProductWithVariant;
    });
  }
);

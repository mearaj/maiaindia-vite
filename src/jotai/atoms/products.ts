import { categoryAtom } from '@/jotai/atoms/index';
import { defaultSelectedCategory } from '@/jotai/data/category';
import { atom } from 'jotai';
import {
  CompoundID,
  CompoundProduct,
  Product,
  VariantImage,
} from '@/jotai/data/product';
import { atomEffect } from 'jotai-effect';
import { collection, onSnapshot, query } from '@firebase/firestore';
import { appFirebaseStorage, appFirestore } from '@/firebase';
import { atomFamily } from 'jotai/utils';
import { getBlob, listAll, ref } from '@firebase/storage';
import { deepEqual } from '@firebase/util';

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

export const productWithImagesSelector = atomFamily((productID: string) => {
  return atom(async (get) => {
    const allProducts = get(allProductsAtom);
    const foundIndex = allProducts.findIndex(
      (eachProduct) => eachProduct.id === productID
    );
    if (foundIndex < 0) {
      throw Error('Product not found.');
    }
    let shouldUpdate = false;
    for await (const [variantIndex, variant] of allProducts[
      foundIndex
    ].variants.entries()) {
      if (!(variant.images && variant.images.length > 0)) {
        shouldUpdate = true;
        const pathRef = ref(
          appFirebaseStorage,
          `products/${allProducts[foundIndex].id}/variants/${variant.id}`
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
          allProducts[foundIndex].variants[variantIndex].images = images;
        } catch (e) {
          allProducts[foundIndex].variants[variantIndex].images = [];
        }
      }
    }
    if (shouldUpdate) {
      atomEffect((_, set) => {
        set(allProductsAtom, allProducts);
      });
    }
    return allProducts[foundIndex];
  });
});

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

export const compoundProductWithImagesSelector = atomFamily(
  (compoundID: CompoundID) => {
    return atom(async (get) => {
      const allProducts = get(allProductsAtom);
      let foundProductIndex: number = -1;
      let foundVariantIndex: number = -1;
      let shouldBreak = false;
      for (const [productIndex, product] of allProducts.entries()) {
        if (compoundID.productID === product.id) {
          foundProductIndex = productIndex;
          for (const [variantIndex, variant] of product.variants.entries()) {
            if (compoundID.variantID === variant.id) {
              foundVariantIndex = variantIndex;
              shouldBreak = true;
              break;
            }
          }
        }
        if (shouldBreak) {
          break;
        }
      }
      if (foundProductIndex < 0) {
        throw Error('Product not found');
      }
      if (foundVariantIndex < 0) {
        throw Error('Product Variant not found');
      }
      const foundProductWithVariant = {
        product: allProducts[foundProductIndex],
        variant: allProducts[foundProductIndex].variants[foundVariantIndex],
      };

      if (
        !foundProductWithVariant.variant.images ||
        !(foundProductWithVariant.variant.images.length > 0)
      ) {
        try {
          const pathRef = ref(
            appFirebaseStorage,
            `products/${foundProductWithVariant.product.id}/variants/${foundProductWithVariant.variant.id}`
          );
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
        // atomEffect((_, set) => {
        //   set(allProductsAtom, allProducts);
        // });
      }

      return {
        product: allProducts[foundProductIndex],
        variant: allProducts[foundProductIndex].variants[foundVariantIndex],
      };
    });
  },
  deepEqual
);

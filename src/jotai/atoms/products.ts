import { categoryAtom } from '@/jotai/atoms/index';
import { defaultSelectedCategory } from '@/jotai/data/category';
import { atom } from 'jotai';
import { CompoundProduct, Product } from '@/jotai/data/product';
import { atomEffect } from 'jotai-effect';
import { collection, onSnapshot, query } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { staticProductImages } from '@/jotai/data/staticImages';
import { atomFamily } from 'jotai/utils';

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
        productToAddModify.variants.forEach((variant) => {
          variant.productID = productToAddModify.id;
          const compoundID = `${productToAddModify.id}-${variant.id}`;
          if (staticProductImages[compoundID]) {
            variant.images = staticProductImages[compoundID];
          } else {
            variant.images = [];
          }
        });
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

export const compoundProductFromCompoundIDSelector = atomFamily(
  (productIDVariantID: string) => {
    const asyncAtom = atom(async (get) => {
      const allProducts = get(allProductsAtom);
      let foundProductWithVariant: CompoundProduct | undefined;
      allProducts.forEach((product) => {
        product.variants.forEach((variant) => {
          const compoundID = `${product.id}-${variant.id}`;
          if (productIDVariantID === compoundID) {
            foundProductWithVariant = { product, variant };
          }
        });
      });
      if (!foundProductWithVariant) {
        throw Error('Product not found');
      }
      return foundProductWithVariant;
    });
    return asyncAtom;
  }
);

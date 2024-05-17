import { appFirestore } from '@/firebase';
import { doc, getDoc } from '@firebase/firestore';
import { ProductImage, ProductWithImages } from '@/jotai/data/product';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

const staticProductIDToImagesMap: { [key: string]: string[] } = {
  DlvdohiBj7OODe9obUrW: [
    'variants/pfUNqrMaitgalN1ZsVVf/lion A.avif',
    'variants/pfUNqrMaitgalN1ZsVVf/lion B.avif',
    'variants/pfUNqrMaitgalN1ZsVVf/lion C.avif',
    'variants/pfUNqrMaitgalN1ZsVVf/lion D.avif',
    'variants/pfUNqrMaitgalN1ZsVVf/lion E.avif',
  ],
  GUo08qHDNOn5b8qDxxaJ: [
    'variants/NTkUeusBulzYgpGZENS4/panther a.avif',
    'variants/NTkUeusBulzYgpGZENS4/panther b.avif',
    'variants/NTkUeusBulzYgpGZENS4/panther c.avif',
    'variants/NTkUeusBulzYgpGZENS4/panther d.avif',
  ],
  HRrQv1NHlz2Qv4U3Iyvm: [
    'variants/tyF3xsvHKAzIA78IzSjE/flash a.avif',
    'variants/tyF3xsvHKAzIA78IzSjE/flash b.avif',
    'variants/tyF3xsvHKAzIA78IzSjE/flash c.avif',
    'variants/tyF3xsvHKAzIA78IzSjE/flash d.avif',
  ],
  KuCETbBe9qOpeSY18d8N: [
    'variants/JZldhOEZ6DAliJiAdCiH/ashok a.avif',
    'variants/JZldhOEZ6DAliJiAdCiH/ashok b.avif',
    'variants/JZldhOEZ6DAliJiAdCiH/ashok c.avif',
    'variants/JZldhOEZ6DAliJiAdCiH/ashok d.avif',
  ],
  SyWtUg5SVIDlmK79RyFB: [
    'variants/fqXitnwQ7P4usnAN2QL0/aum a.avif',
    'variants/fqXitnwQ7P4usnAN2QL0/aum b.avif',
    'variants/fqXitnwQ7P4usnAN2QL0/aum c.avif',
    'variants/fqXitnwQ7P4usnAN2QL0/aum d.avif',
    'variants/fqXitnwQ7P4usnAN2QL0/aum e.avif',
  ],
  U01R8PYLirAM21Whg3zT: [
    'variants/PKfqMMWGeMI1GMAZX7dJ/gada a.avif',
    'variants/PKfqMMWGeMI1GMAZX7dJ/gada b.avif',
    'variants/PKfqMMWGeMI1GMAZX7dJ/gada c.avif',
    'variants/PKfqMMWGeMI1GMAZX7dJ/gada d.avif',
  ],
  VZXq9RDl50B7gcPa1UQW: [
    'variants/eCVohuiqtN5ycdfnWJ8x/heel a.avif',
    'variants/eCVohuiqtN5ycdfnWJ8x/heel b.avif',
    'variants/eCVohuiqtN5ycdfnWJ8x/heel c.avif',
    'variants/eCVohuiqtN5ycdfnWJ8x/heel d.avif',
  ],
  Wi1XjKTUsykslkzz0acD: [
    'variants/MeD3qfznv0x3ICgImmhu/sneaker colour a.avif',
    'variants/MeD3qfznv0x3ICgImmhu/sneaker colour b.avif',
    'variants/MeD3qfznv0x3ICgImmhu/sneaker colour c.avif',
    'variants/MeD3qfznv0x3ICgImmhu/sneaker colour d.avif',
  ],
  Won7hq5GuVJeJpbNBSyC: [
    'variants/g6K4oR9vJ3c1xIo27LTA/A.avif',
    'variants/g6K4oR9vJ3c1xIo27LTA/B.avif',
    'variants/g6K4oR9vJ3c1xIo27LTA/C.avif',
    'variants/g6K4oR9vJ3c1xIo27LTA/D.avif',
  ],
  qCoDN4vPzZvIzIbY7vBB: [
    'variants/sZ0CQeVKEZ9AItE0rM2K/sneaker white a.avif',
    'variants/sZ0CQeVKEZ9AItE0rM2K/sneaker white b.avif',
    'variants/sZ0CQeVKEZ9AItE0rM2K/sneaker white c.avif',
    'variants/sZ0CQeVKEZ9AItE0rM2K/sneaker white d.avif',
  ],
};

const staticProductImages: { [key: string]: ProductImage[] } = Object.keys(
  staticProductIDToImagesMap
).reduce((previousValue, currentValue) => {
  return {
    ...previousValue,
    [currentValue]: staticProductIDToImagesMap[currentValue].map(
      (eachProduct) => {
        return {
          name: eachProduct,
          url: `/products/${currentValue}/${eachProduct}`,
        };
      }
    ),
  };
}, {});

export const productIdSelector = atomFamily((param: string) => {
  const asyncAtom = atom(async () => {
    const docRef = doc(appFirestore, 'products', param);
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      throw Error('Product not found');
    }
    const productToAddModify = {
      ...docSnapshot.data(),
      id: docSnapshot.id,
    } as ProductWithImages;
    if (staticProductImages[docSnapshot.id]) {
      productToAddModify.images = staticProductImages[docSnapshot.id];
    } else {
      productToAddModify.images = [];
    }
    return productToAddModify;
  });
  return asyncAtom;
});

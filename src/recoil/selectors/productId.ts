import { selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { appFirestore } from '@/firebase';
import { doc, getDoc } from '@firebase/firestore';
import { ProductImage, ProductWithImages } from '@/recoil/data/product';

const staticProductIDToImagesMap: { [key: string]: string[] } = {
  DlvdohiBj7OODe9obUrW: [
    'lion A.avif',
    'lion B.avif',
    'lion C.avif',
    'lion D.avif',
    'lion E.avif',
  ],
  GUo08qHDNOn5b8qDxxaJ: [
    'panther a.avif',
    'panther b.avif',
    'panther c.avif',
    'panther d.avif',
  ],
  HRrQv1NHlz2Qv4U3Iyvm: [
    'flash a.avif',
    'flash b.avif',
    'flash c.avif',
    'flash d.avif',
  ],
  KuCETbBe9qOpeSY18d8N: [
    'ashok a.avif',
    'ashok b.avif',
    'ashok c.avif',
    'ashok d.avif',
  ],
  SyWtUg5SVIDlmK79RyFB: [
    'aum a.avif',
    'aum b.avif',
    'aum c.avif',
    'aum d.avif',
    'aum e.avif',
  ],
  U01R8PYLirAM21Whg3zT: [
    'gada a.avif',
    'gada b.avif',
    'gada c.avif',
    'gada d.avif',
  ],
  VZXq9RDl50B7gcPa1UQW: [
    'heel a.avif',
    'heel b.avif',
    'heel c.avif',
    'heel d.avif',
  ],
  Wi1XjKTUsykslkzz0acD: [
    'sneaker colour a.avif',
    'sneaker colour b.avif',
    'sneaker colour c.avif',
    'sneaker colour d.avif',
  ],
  Won7hq5GuVJeJpbNBSyC: ['A.avif', 'B.avif', 'C.avif', 'D.avif'],
  qCoDN4vPzZvIzIbY7vBB: [
    'sneaker white a.avif',
    'sneaker white b.avif',
    'sneaker white c.avif',
    'sneaker white d.avif',
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

export const productIdSelector = selectorFamily({
  key: recoilKeys.productIdSelector,
  get: (productID: string) => async () => {
    const docRef = doc(appFirestore, 'products', productID);
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
    // const imagesRef = ref(appFirebaseStorage, `products/${productID}`);
    // const allListRef = await listAll(imagesRef);
    // productToAddModify.images = [];
    // for await (const eachImageRef of allListRef.items) {
    //   const imageURL = await getDownloadURL(eachImageRef);
    //   productToAddModify.images.push({
    //     url: imageURL,
    //     name: eachImageRef.name,
    //   });
    // }
    return productToAddModify;
  },
});

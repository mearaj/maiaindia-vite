import { VariantImage } from '@/jotai/data/product';

const staticProductNVariantIDToImagesMap: { [key: string]: string[] } = {
  'DlvdohiBj7OODe9obUrW-pfUNqrMaitgalN1ZsVVf': [
    'lion A.avif',
    'lion B.avif',
    'lion C.avif',
    'lion D.avif',
    'lion E.avif',
  ],
  'GUo08qHDNOn5b8qDxxaJ-NTkUeusBulzYgpGZENS4': [
    'panther a.avif',
    'panther b.avif',
    'panther c.avif',
    'panther d.avif',
  ],
  'HRrQv1NHlz2Qv4U3Iyvm-tyF3xsvHKAzIA78IzSjE': [
    'flash a.avif',
    'flash b.avif',
    'flash c.avif',
    'flash d.avif',
  ],
  'KuCETbBe9qOpeSY18d8N-JZldhOEZ6DAliJiAdCiH': [
    'ashok a.avif',
    'ashok b.avif',
    'ashok c.avif',
    'ashok d.avif',
  ],
  'SyWtUg5SVIDlmK79RyFB-fqXitnwQ7P4usnAN2QL0': [
    'aum a.avif',
    'aum b.avif',
    'aum c.avif',
    'aum d.avif',
    'aum e.avif',
  ],
  'U01R8PYLirAM21Whg3zT-PKfqMMWGeMI1GMAZX7dJ': [
    'gada a.avif',
    'gada b.avif',
    'gada c.avif',
    'gada d.avif',
  ],
  'VZXq9RDl50B7gcPa1UQW-eCVohuiqtN5ycdfnWJ8x': [
    'heel a.avif',
    'heel b.avif',
    'heel c.avif',
    'heel d.avif',
  ],
  'Wi1XjKTUsykslkzz0acD-MeD3qfznv0x3ICgImmhu': [
    'sneaker colour a.avif',
    'sneaker colour b.avif',
    'sneaker colour c.avif',
    'sneaker colour d.avif',
  ],
  'Won7hq5GuVJeJpbNBSyC-g6K4oR9vJ3c1xIo27LTA': [
    'A.avif',
    'B.avif',
    'C.avif',
    'D.avif',
  ],
  'qCoDN4vPzZvIzIbY7vBB-sZ0CQeVKEZ9AItE0rM2K': [
    'sneaker white a.avif',
    'sneaker white b.avif',
    'sneaker white c.avif',
    'sneaker white d.avif',
  ],
};

export const staticProductImages: { [key: string]: VariantImage[] } =
  Object.keys(staticProductNVariantIDToImagesMap).reduce(
    (previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue]: staticProductNVariantIDToImagesMap[currentValue].map(
          (eachProduct) => {
            const idsArray = currentValue.split('-');
            const productID = idsArray[0];
            const variantID = idsArray[1];
            return {
              name: eachProduct,
              url: `/products/${productID}/variants/${variantID}/${eachProduct}`,
            };
          }
        ),
      };
    },
    {}
  );

import imagePlaceholder from '@/assets/images/placeholder.svg';
import { Location } from 'react-router-dom';
import { Product, ProductImage } from '@/firebase/product';

const defaultProductImage: ProductImage = {
  width: 680,
  height: 528,
  name: 'Placeholder',
  src: imagePlaceholder,
};
const getPreferredImageSrc = (product: Product): ProductImage[] => {
  if (!product.images || product.images.length < 1) {
    return [defaultProductImage];
  }
  return product.images.map((eachImage) => {
    return {
      ...eachImage,
      src: `https://firebasestorage.googleapis.com/v0/b/maiaindia.appspot.com/o/images%2F${product.id}%2F${eachImage.name}?alt=media`,
    };
  });
};

export const isActiveByEqual = (currentPaths: string[], location: Location) => {
  for (let i = 0; i < currentPaths.length; i += 1) {
    if (location.pathname === currentPaths[i]) {
      return true;
    }
  }
  return false;
};

export const isActiveByStartsWith = (
  currentPaths: string[],
  location: Location
) => {
  for (let i = 0; i < currentPaths.length; i += 1) {
    if (location.pathname.startsWith(currentPaths[i])) {
      return true;
    }
  }
  return false;
};

export default getPreferredImageSrc;

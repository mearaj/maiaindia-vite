import staticProducts, { Product } from '@/recoil/data/product';
import { ImageMetadata } from '@/recoil/data/image';

const getPreferredImageSrc = (product: Product): ImageMetadata => {
  const image: ImageMetadata = {};
  const images = [...(product.images ?? [])];
  if (images && images.length > 0) {
    const found = staticProducts.find((p) => p === product.id);
    for (let i = 0; i < images.length; i += 1) {
      const dim = images[i].match(/(\d+[xX]\d+)/);
      if (dim && dim?.length > 0) {
        const dims = dim[0].split(/[xX]/);
        if (dims.length > 0) {
          if (found) {
            images[i] = `/images/${product.id}/${images[i]} ${dims[0]}w`;
          } else {
            images[
              i
            ] = `https://firebasestorage.googleapis.com/v0/b/maiaindia.appspot.com/o/images%2F${product.id}%2F${images[i]}?alt=media ${dims[0]}w`;
          }
        }
      }
    }
    [image.src] = images[images.length - 1].split(' ');
    image.srcSet = images.join(',');
  }
  return image;
};
export default getPreferredImageSrc;

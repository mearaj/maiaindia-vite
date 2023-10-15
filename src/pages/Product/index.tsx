import { Header, Loader } from '@/components';
import { Box } from '@mui/material';
import { useGetProductQuery } from '@/store/api/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { defaultPlaceholderImage, ImageMetadata } from '@/store/data/data';
import { useParams } from 'react-router-dom';
import ProductPrice from '@/components/Product/Price';
import ProductActions from '@/components/Product/Actions';
import styles from './index.module.css';

export default function ProductPage() {
  const params = useParams();
  const { isFetching, data: product } = useGetProductQuery(params.id as string);

  let body;
  if (isFetching) {
    body = (
      <Box className={styles.bodyAlt}>
        <Loader />
      </Box>
    );
  } else if (!product) {
    body = <Box className={styles.bodyAlt}>Product Not found</Box>;
  } else {
    const getPreferredImageSrc = (): ImageMetadata => {
      const image = { ...defaultPlaceholderImage };
      const images = [...(product.images ?? [])];
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i += 1) {
          const dim = images[i].match(/(\d+[xX]\d+)/);
          if (dim && dim?.length > 0) {
            const dims = dim[0].split(/[xX]/);
            if (dims.length > 0) {
              images[i] = `/images/${product.id}/${images[i]} ${dims[0]}w`;
            }
          }
        }
        image.src = images[images.length - 1];
        image.srcSet = images.join(',');
      }
      return image;
    };
    body = (
      <Box className={styles.body}>
        <Swiper
          className={styles.swiper}
          modules={[Pagination]}
          slidesPerView={1}
          loop
          pagination
        >
          {[1, 2, 3, 4, 5].map((_, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <SwiperSlide key={index} className={styles.slide}>
                <img
                  srcSet={getPreferredImageSrc().srcSet}
                  src={getPreferredImageSrc().src}
                  alt={product.name}
                  className={styles.image}
                  placeholder="blur"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className={styles.productDetails}>
          <div className={styles.productName}>{product.name}</div>
          <ProductPrice />
        </div>
        <ProductActions product={product} />
      </Box>
    );
  }

  return (
    <Box className={styles.layout}>
      <Header showBackIcon />
      {body}
    </Box>
  );
}

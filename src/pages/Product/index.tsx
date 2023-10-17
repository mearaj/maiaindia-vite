import { Header, Loader } from '@/components';
import { Box, useTheme } from '@mui/material';
import { useGetProductQuery } from '@/store/api/api';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { ImageMetadata } from '@/store/data/data';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import ProductPrice from '@/components/Product/Price';
import ProductActions from '@/components/Product/Actions';
import styles from './index.module.css';
import Placeholder from '@/icons/placeholder';

export default function ProductPage() {
  const params = useParams();
  const { isFetching, data: product } = useGetProductQuery(params.id as string);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | undefined>();
  const theme = useTheme();

  if (isFetching) {
    return (
      <Box className={styles.layout}>
        <Header showBackIcon />
        <Box className={styles.bodyAlt}>
          <Loader />
        </Box>
      </Box>
    );
  }
  if (!product) {
    return (
      <Box className={styles.layout}>
        <Header showBackIcon />
        <Box className={styles.bodyAlt}>Product Not found</Box>
      </Box>
    );
  }
  const getPreferredImageSrc = (): ImageMetadata => {
    const image: ImageMetadata = {};
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

  return (
    <Box className={styles.layout}>
      <Header showBackIcon />
      <Box className={styles.body}>
        <Swiper
          className={styles.swiper}
          modules={[FreeMode, Navigation, Thumbs]}
          thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
          slidesPerView={1}
          loop
          navigation
        >
          {[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }].map(
            (item) => {
              return (
                <SwiperSlide key={item.id} className={styles.slide}>
                  {!getPreferredImageSrc().srcSet ? (
                    <Placeholder
                      fillOne={theme.palette.primary.light}
                      height="100%"
                      style={{
                        backgroundColor: theme.palette.primary.light,
                        height: '100%',
                        width: 'auto',
                      }}
                    />
                  ) : (
                    <img
                      srcSet={getPreferredImageSrc().srcSet}
                      src={getPreferredImageSrc().src}
                      alt={product.name}
                      className={styles.image}
                      placeholder="blur"
                    />
                  )}
                </SwiperSlide>
              );
            }
          )}
        </Swiper>
        <Swiper
          onSwiper={setThumbsSwiper}
          className={styles.swiperThumbs}
          modules={[FreeMode, Navigation, Thumbs]}
          spaceBetween={8}
          slidesPerView={3}
          freeMode
          watchSlidesProgress
          loop
        >
          {[{ id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 }].map(
            (item) => {
              return (
                <SwiperSlide key={item.id} className={styles.thumbsSlide}>
                  {!getPreferredImageSrc().srcSet ? (
                    <Placeholder
                      fillOne={theme.palette.primary.light}
                      height="100%"
                      style={{
                        backgroundColor: theme.palette.primary.light,
                        height: '100%',
                        width: 'auto',
                      }}
                    />
                  ) : (
                    <img
                      srcSet={getPreferredImageSrc().srcSet}
                      src={getPreferredImageSrc().src}
                      alt={product.name}
                      className={styles.image}
                      placeholder="blur"
                    />
                  )}
                </SwiperSlide>
              );
            }
          )}
        </Swiper>
        <div className={styles.productDetails}>
          <div className={styles.productName}>{product.name}</div>
          <ProductPrice />
        </div>
        <ProductActions product={product} />
      </Box>
    </Box>
  );
}

import { Header, Loader } from '@/components';
import { Box, useTheme } from '@mui/material';
import { useGetProductQuery } from '@/store/api/api';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import getPreferredImageSrc from '@/misc';
import ProductActions from '@/components/Product/Actions';
import ProductPrice from '@/components/Product/Price';
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

  const preferredImgSrc = getPreferredImageSrc(product);
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
                  {!preferredImgSrc.srcSet ? (
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
                      srcSet={preferredImgSrc.srcSet}
                      src={preferredImgSrc.src}
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
          spaceBetween={18}
          slidesPerView={3}
          freeMode
          watchSlidesProgress
          loop
        >
          {[{ id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 }].map(
            (item) => {
              return (
                <SwiperSlide key={item.id} className={styles.thumbsSlide}>
                  {!preferredImgSrc.srcSet ? (
                    <Placeholder
                      fillOne={theme.palette.primary.light}
                      height="100%"
                      className={styles.image}
                      style={{
                        backgroundColor: theme.palette.primary.light,
                        height: '100%',
                        width: '100%',
                      }}
                    />
                  ) : (
                    <img
                      srcSet={preferredImgSrc.srcSet}
                      src={preferredImgSrc.src}
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
          <ProductPrice product={product} />
        </div>
        <ProductActions product={product} sx={{ height: 'auto' }} />
      </Box>
    </Box>
  );
}

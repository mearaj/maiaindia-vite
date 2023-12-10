import { Box } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import placeholderImage from '@/assets/images/placeholder.svg';
import {
  productFormImagesSelector,
  productFormLocalImagesSelector,
} from '@/recoil/selectors/productForm';
import styles from './index.module.css';

export default function AddEditProductImagesComponent() {
  const productImages = useRecoilValue(productFormImagesSelector);
  const localImages = useRecoilValue(productFormLocalImagesSelector);

  return (
    <Box className={styles.swiperContainer}>
      <Box>Backend Images Count:{productImages.length}</Box>
      <Box sx={{ marginBottom: '16px' }}>
        Local Images Count:{localImages.length}
      </Box>
      <Swiper
        className={styles.swiper}
        modules={[FreeMode, Navigation, Thumbs]}
        slidesPerView={1}
        navigation
      >
        {productImages.length === 0 && localImages.length === 0 ? (
          <SwiperSlide className={styles.slide}>
            <img
              src={placeholderImage}
              alt="Placeholder"
              className={styles.image}
              placeholder="blur"
            />
          </SwiperSlide>
        ) : (
          <>
            {productImages.map((item) => (
              <SwiperSlide key={item.url} className={styles.slide}>
                <img
                  src={item.url}
                  alt={item.name}
                  className={styles.image}
                  placeholder="blur"
                />
              </SwiperSlide>
            ))}
            {localImages.map((item) => (
              <SwiperSlide key={item.url} className={styles.slide}>
                <img
                  src={item.url}
                  alt={item.file.name}
                  className={styles.image}
                  placeholder="blur"
                />
              </SwiperSlide>
            ))}
          </>
        )}
      </Swiper>
    </Box>
  );
}

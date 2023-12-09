import { Box } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import placeholderImage from '@/assets/images/placeholder.svg';
import { productFormImagesSelector } from '@/recoil/selectors/productForm';
import styles from './index.module.css';

export default function AddEditProductImagesComponent() {
  const productImages = useRecoilValue(productFormImagesSelector);

  return (
    <Box className={styles.swiperContainer}>
      <Box sx={{ marginBottom: '16px' }}>
        Images Count:{productImages.length}
      </Box>
      <Swiper
        className={styles.swiper}
        modules={[FreeMode, Navigation, Thumbs]}
        slidesPerView={1}
        navigation
      >
        {productImages.length === 0 ? (
          <SwiperSlide className={styles.slide}>
            <img
              src={placeholderImage}
              alt="Placeholder"
              className={styles.image}
              placeholder="blur"
            />
          </SwiperSlide>
        ) : (
          productImages.map((item) => (
            <SwiperSlide key={item.url} className={styles.slide}>
              <img
                src={item.url}
                alt={item.name}
                className={styles.image}
                placeholder="blur"
              />
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </Box>
  );
}

import { Box } from '@mui/material';
import { useRecoilValueLoadable } from 'recoil';
import { imagesByProductIDSelector } from '@/recoil/selectors/products';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Loader } from '@/components';
import { Product } from '@/recoil/data/product';
import placeholderImage from '@/assets/images/placeholder.svg';
import { ReactNode } from 'react';
import styles from './index.module.css';

interface AddEditProductImagesProps {
  product: Product;
}

export default function AddEditProductImages({
  product,
}: AddEditProductImagesProps) {
  const { contents: preferredImgSrc, state: imagesState } =
    useRecoilValueLoadable(imagesByProductIDSelector(product.id));

  if (imagesState === 'hasError') {
    return (
      <Box className={styles.layout}>
        <Box className={styles.bodyAlt}>
          {preferredImgSrc.message
            ? preferredImgSrc.message
            : 'Error loading images'}
        </Box>
      </Box>
    );
  }

  let slideComponents: ReactNode;
  if (imagesState !== 'loading') {
    if (preferredImgSrc.length === 0) {
      slideComponents = (
        <SwiperSlide className={styles.slide}>
          <img
            src={placeholderImage}
            alt="Placeholder"
            className={styles.image}
            placeholder="blur"
          />
        </SwiperSlide>
      );
    } else {
      slideComponents = preferredImgSrc.map((item) => {
        return (
          <SwiperSlide key={item} className={styles.slide}>
            <img
              src={item}
              alt={item}
              className={styles.image}
              placeholder="blur"
            />
          </SwiperSlide>
        );
      });
    }
  }

  return (
    <Box className={styles.body}>
      {imagesState === 'loading' ? null : (
        <Box sx={{ marginBottom: '16px' }}>
          Images Count:{preferredImgSrc.length}
        </Box>
      )}
      <Swiper
        className={styles.swiper}
        modules={[FreeMode, Navigation, Thumbs]}
        slidesPerView={1}
        loop
        navigation
      >
        {imagesState === 'loading' ? <Loader /> : slideComponents}
      </Swiper>
    </Box>
  );
}

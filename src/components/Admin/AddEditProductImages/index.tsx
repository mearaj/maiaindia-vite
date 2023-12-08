import { Box } from '@mui/material';
import { useRecoilValueLoadable } from 'recoil';
import { imagesByProductIDSelector } from '@/recoil/selectors/products';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Product } from '@/recoil/data/product';
import placeholderImage from '@/assets/images/placeholder.svg';
import styles from './index.module.css';
import RecoilLoadableComponent from '@/components/Layouts/RecoilLoadableComponent';

interface AddEditProductComponentImagesProps {
  product: Product;
}

export default function AddEditProductComponentImages({
  product,
}: AddEditProductComponentImagesProps) {
  const recoilValueLoadable = useRecoilValueLoadable(
    imagesByProductIDSelector(product.id)
  );

  const imagesURLs =
    recoilValueLoadable.state === 'hasValue' && recoilValueLoadable.contents
      ? recoilValueLoadable.contents
      : [];

  return (
    <Box className={styles.swiperContainer}>
      <RecoilLoadableComponent
        loaderContainerStyle={{ width: '100%', height: '40vh' }}
        errorContainerStyle={{ width: '100%', height: '40vh' }}
        recoilLoadable={recoilValueLoadable}
      >
        <Box sx={{ marginBottom: '16px' }}>
          Images Count:{imagesURLs.length}
        </Box>
        <Swiper
          className={styles.swiper}
          modules={[FreeMode, Navigation, Thumbs]}
          slidesPerView={1}
          navigation
        >
          {imagesURLs.length === 0 ? (
            <SwiperSlide className={styles.slide}>
              <img
                src={placeholderImage}
                alt="Placeholder"
                className={styles.image}
                placeholder="blur"
              />
            </SwiperSlide>
          ) : (
            imagesURLs.map((item) => (
              <SwiperSlide key={item} className={styles.slide}>
                <img
                  src={item}
                  alt={item}
                  className={styles.image}
                  placeholder="blur"
                />
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </RecoilLoadableComponent>
    </Box>
  );
}

import { Box } from '@mui/material';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { imagesByProductIDSelector } from '@/recoil/selectors/products';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Product } from '@/recoil/data/product';
import placeholderImage from '@/assets/images/placeholder.svg';
import { useEffect, useMemo } from 'react';
import { productFormImagesSelector } from '@/recoil/selectors/productForm';
import styles from './index.module.css';
import RecoilLoadableComponent from '@/components/Layouts/RecoilLoadableComponent';

interface AddEditProductComponentImagesProps {
  product: Product;
}

export default function AddEditProductImagesComponent({
  product,
}: AddEditProductComponentImagesProps) {
  const recoilValueLoadable = useRecoilValueLoadable(
    imagesByProductIDSelector(product.id)
  );
  const setProductFormImages = useSetRecoilState(productFormImagesSelector);

  const imagesURLs = useMemo(() => {
    return recoilValueLoadable.state === 'hasValue' &&
      recoilValueLoadable.contents
      ? recoilValueLoadable.contents
      : [];
  }, [recoilValueLoadable.contents, recoilValueLoadable.state]);

  useEffect(() => {
    setProductFormImages(imagesURLs);
  }, [imagesURLs, setProductFormImages]);

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
      </RecoilLoadableComponent>
    </Box>
  );
}

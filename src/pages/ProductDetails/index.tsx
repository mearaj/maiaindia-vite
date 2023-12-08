import { Header } from '@/components';
import { Box } from '@mui/material';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import { imagesByProductIDSelector } from '@/recoil/selectors/products';
import ProductPrice from '@/components/Product/Price';
import styles from './index.module.css';
import AddUpdateButton from '@/components/Buttons/AddUpdate';
import BuyButton from '@/components/Buttons/Buy';
import RecoilLoadableComponent from '@/components/Layouts/RecoilLoadableComponent';

export default function ProductDetailsPage() {
  const params = useParams();
  const recoilProductLoadable = useRecoilValueLoadable(
    productIdSelector(params.id as string)
  );
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | undefined>();
  const recoilProductImagesLoadable = useRecoilValueLoadable(
    imagesByProductIDSelector(params.id as string)
  );

  const product =
    recoilProductLoadable.state === 'hasValue' && recoilProductLoadable.contents
      ? recoilProductLoadable.contents
      : undefined;
  const productImages =
    recoilProductImagesLoadable.state === 'hasValue' &&
    product &&
    recoilProductImagesLoadable.contents
      ? recoilProductImagesLoadable.contents
      : undefined;

  return (
    <Box className={styles.layout}>
      <Header showBackIcon />
      <Box className={styles.body}>
        <RecoilLoadableComponent recoilLoadable={recoilProductLoadable}>
          <Swiper
            className={styles.swiper}
            modules={[FreeMode, Navigation, Thumbs]}
            thumbs={
              thumbsSwiper && productImages
                ? { swiper: thumbsSwiper }
                : undefined
            }
            slidesPerView={1}
            navigation
          >
            {product &&
              productImages &&
              productImages.map((item) => {
                return (
                  <SwiperSlide key={item} className={styles.slide}>
                    <img
                      src={item}
                      alt={product.name}
                      className={styles.image}
                      placeholder="blur"
                    />
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </RecoilLoadableComponent>
        <RecoilLoadableComponent recoilLoadable={recoilProductImagesLoadable}>
          <Swiper
            onSwiper={setThumbsSwiper}
            className={styles.swiperThumbs}
            modules={[FreeMode, Navigation, Thumbs]}
            spaceBetween={4}
            slidesPerView="auto"
            freeMode
            watchSlidesProgress
          >
            {product &&
              productImages &&
              productImages.map((item) => {
                return (
                  <SwiperSlide key={item} className={styles.thumbsSlide}>
                    <img
                      src={item}
                      alt={product.name}
                      className={styles.thumbnailImage}
                      placeholder="blur"
                    />
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </RecoilLoadableComponent>
        {product && (
          <>
            <div className={styles.productDetails}>
              <div className={styles.productName}>{product.name}</div>
              <ProductPrice product={product} />
            </div>
            <Box sx={{ padding: '16px' }}>
              <Box sx={{ marginBottom: '8px' }}>
                <AddUpdateButton product={product} />
              </Box>
              <BuyButton product={product} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

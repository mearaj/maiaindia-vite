import { Header } from '@/components';
import { Box } from '@mui/material';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
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

  const product =
    recoilProductLoadable.state === 'hasValue' && recoilProductLoadable.contents
      ? recoilProductLoadable.contents
      : undefined;
  return (
    <Box className={styles.layout}>
      <Header showBackIcon />
      <Box className={styles.body}>
        <RecoilLoadableComponent
          loaderContainerStyle={{ height: '80vh', width: '100%' }}
          errorContainerStyle={{ height: '80vh', width: '100%' }}
          recoilLoadable={recoilProductLoadable}
        >
          {product && product.images && product.images.length > 0 && (
            <>
              <Swiper
                className={styles.swiper}
                modules={[FreeMode, Navigation, Thumbs]}
                slidesPerView={1}
                navigation
                thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
              >
                {product.images.map((item) => {
                  return (
                    <SwiperSlide key={item.url} className={styles.slide}>
                      <img
                        src={item.url}
                        alt={recoilProductLoadable.contents.name}
                        className={styles.image}
                        placeholder="blur"
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <Swiper
                className={styles.swiperThumbs}
                modules={[FreeMode, Navigation, Thumbs]}
                spaceBetween={4}
                slidesPerView="auto"
                freeMode
                watchSlidesProgress
                onSwiper={setThumbsSwiper}
              >
                {product.images.map((item) => {
                  return (
                    <SwiperSlide key={item.url} className={styles.thumbsSlide}>
                      <img
                        src={item.url}
                        alt={recoilProductLoadable.contents.name}
                        className={styles.thumbnailImage}
                        placeholder="blur"
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </>
          )}
        </RecoilLoadableComponent>
        {product && (
          <>
            <div className={styles.productDetails}>
              <div className={styles.productName}>
                {recoilProductLoadable.contents.name}
              </div>
              <ProductPrice product={recoilProductLoadable.contents} />
            </div>
            <Box sx={{ padding: '16px' }}>
              <Box sx={{ marginBottom: '8px' }}>
                <AddUpdateButton product={recoilProductLoadable.contents} />
              </Box>
              <BuyButton product={recoilProductLoadable.contents} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

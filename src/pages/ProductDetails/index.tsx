import { Header, Loader } from '@/components';
import { Box } from '@mui/material';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { ReactNode, useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import { imagesByProductIDSelector } from '@/recoil/selectors/products';
import ProductPrice from '@/components/Product/Price';
import styles from './index.module.css';
import AddUpdateButton from '@/components/Buttons/AddUpdate';
import BuyButton from '@/components/Buttons/Buy';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function ProductDetailsPage() {
  const params = useParams();
  const { contents, state } = useRecoilValueLoadable(
    productIdSelector(params.id as string)
  );
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | undefined>();
  const { contents: preferredImgSrc, state: imagesState } =
    useRecoilValueLoadable(imagesByProductIDSelector(params.id as string));

  if (state === 'hasError' || imagesState === 'hasError') {
    return (
      <CommonPageLayout>
        <Box className={styles.bodyAlt}>{contents.toString()}</Box>
      </CommonPageLayout>
    );
  }
  if (state === 'loading') {
    return (
      <CommonPageLayout>
        <Loader />
      </CommonPageLayout>
    );
  }
  let swiperComponent: ReactNode;
  let swiperThumbsComponent: ReactNode;
  if (imagesState === 'loading') {
    swiperComponent = (
      <Box className={styles.swiper} sx={{ display: 'flex' }}>
        <Box className={styles.slide} sx={{ margin: 'auto' }}>
          <Loader />
        </Box>
      </Box>
    );
    swiperThumbsComponent = (
      <Box className={styles.swiperThumbs}>
        <Box className={styles.thumbsSlide}>
          <Loader />
        </Box>
      </Box>
    );
  } else {
    swiperComponent = (
      <Swiper
        className={styles.swiper}
        modules={[FreeMode, Navigation, Thumbs]}
        thumbs={
          thumbsSwiper && preferredImgSrc ? { swiper: thumbsSwiper } : undefined
        }
        slidesPerView={1}
        loop
        navigation
      >
        {preferredImgSrc.map((item) => {
          return (
            <SwiperSlide key={item} className={styles.slide}>
              <img
                src={item}
                alt={contents.name}
                className={styles.image}
                placeholder="blur"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
    swiperThumbsComponent = (
      <Swiper
        onSwiper={setThumbsSwiper}
        className={styles.swiperThumbs}
        modules={[FreeMode, Navigation, Thumbs]}
        spaceBetween={4}
        slidesPerView="auto"
        freeMode
        watchSlidesProgress
        loop
      >
        {preferredImgSrc.map((item) => {
          return (
            <SwiperSlide key={item} className={styles.thumbsSlide}>
              <img
                src={item}
                alt={contents.name}
                className={styles.thumbnailImage}
                placeholder="blur"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  }

  return (
    <Box className={styles.layout}>
      <Header showBackIcon />
      <Box className={styles.body}>
        {swiperComponent}
        {swiperThumbsComponent}
        <div className={styles.productDetails}>
          <div className={styles.productName}>{contents.name}</div>
          <ProductPrice product={contents} />
        </div>
        <Box sx={{ padding: '16px' }}>
          <Box sx={{ marginBottom: '8px' }}>
            <AddUpdateButton product={contents} />
          </Box>
          <BuyButton product={contents} />
        </Box>
      </Box>
    </Box>
  );
}

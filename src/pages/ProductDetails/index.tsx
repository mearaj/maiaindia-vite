import { Header, Loader } from '@/components';
import { Box } from '@mui/material';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import getPreferredImageSrc from '@/misc';
import { useRecoilValueLoadable } from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import ProductPrice from '@/components/Product/Price';
import styles from './index.module.css';
import AddUpdateButton from '@/components/Buttons/AddUpdate';
import BuyButton from '@/components/Buttons/Buy';

export default function ProductDetailsPage() {
  const params = useParams();
  const { contents, state } = useRecoilValueLoadable(
    productIdSelector(params.id as string)
  );
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | undefined>();

  if (state === 'hasError') {
    return (
      <Box className={styles.layout}>
        <Header />
        <Box className={styles.bodyAlt}>{contents.toString()}</Box>
      </Box>
    );
  }
  if (state === 'loading') {
    return <Loader showHeader />;
  }

  const preferredImgSrc = getPreferredImageSrc(contents);
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
          {preferredImgSrc.map((item) => {
            return (
              <SwiperSlide key={item.name} className={styles.slide}>
                <img
                  src={item.src}
                  height={item.height}
                  width={item.width}
                  alt={item.name}
                  className={styles.image}
                  placeholder="blur"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
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
              <SwiperSlide key={item.name} className={styles.thumbsSlide}>
                <img
                  src={item.src}
                  height={item.height}
                  width={item.width}
                  alt={item.name}
                  className={styles.thumbnailImage}
                  placeholder="blur"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className={styles.productDetails}>
          <div className={styles.productName}>{contents.name}</div>
          <ProductPrice product={contents} />
        </div>
        <Box sx={{ padding: '16px' }}>
          <AddUpdateButton
            product={contents}
            sxAddButton={{ marginBottom: '16px' }}
          />
          <BuyButton product={contents} />
        </Box>
      </Box>
    </Box>
  );
}

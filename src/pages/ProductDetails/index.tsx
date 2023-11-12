import { Header, Loader } from '@/components';
import { Box } from '@mui/material';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import getPreferredImageSrc from '@/misc';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { activeProductIdAtom } from '@/recoil/atoms/product';
import { activeProductIdSelector } from '@/recoil/selectors/productId';
import ProductPrice from '@/components/Product/Price';
import styles from './index.module.css';
import AddUpdateButton from '@/components/Buttons/AddUpdate';
import BuyButton from '@/components/Buttons/Buy';

export default function ProductDetailsPage() {
  const params = useParams();
  const [productID, setProductID] = useRecoilState(activeProductIdAtom);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | undefined>();
  const productLoadable = useRecoilValueLoadable(activeProductIdSelector);
  const { data: product, error } = productLoadable.contents;

  useEffect(() => {
    const paramsID = params.id as string;
    if (productID !== paramsID) {
      setProductID(paramsID);
    }
  }, [params.id, productID, setProductID]);

  if (productLoadable.state === 'hasError' || error) {
    return (
      <Box className={styles.layout}>
        <Header />
        <Box className={styles.bodyAlt}>{error}</Box>
      </Box>
    );
  }
  if (productLoadable.state === 'loading' || params.id !== productID) {
    return <Loader showHeader />;
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
          <div className={styles.productName}>{product.name}</div>
          <ProductPrice product={product} />
        </div>
        <Box sx={{ padding: '16px' }}>
          <AddUpdateButton
            product={product}
            sxAddButton={{ marginBottom: '16px' }}
          />
          <BuyButton product={product} />
        </Box>
      </Box>
    </Box>
  );
}

import { Header, Loader } from '@/components';
import { Box } from '@mui/material';
import { useGetProductQuery } from '@/store/api/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import ProductPrice from '@/components/Product/Price';
import ProductActions from '@/components/Product/Actions';
import {
  defaultPlaceholderImage,
  ImageMetadate,
  productResolutions,
} from '@/store/data/data';
import useDimensions from '@/hooks/dimensions';
import { useParams } from 'react-router-dom';
import styles from './index.module.css';

export default function ProductPage() {
  const params = useParams();
  const { isFetching, data: product } = useGetProductQuery(params.id as string);
  const dimensions = useDimensions();

  let body;
  if (isFetching) {
    body = (
      <Box className={styles.bodyAlt}>
        <Loader />
      </Box>
    );
  } else if (!product) {
    body = <Box className={styles.bodyAlt}>Product Not found</Box>;
  } else {
    const getPreferredImageSrc = (): ImageMetadate => {
      const image = { ...defaultPlaceholderImage };
      let includePaths: string[] = [];
      if (dimensions.width < 600) {
        includePaths = [
          productResolutions.res540x540,
          productResolutions.res540x405,
        ];
      } else if (dimensions.width < 1080) {
        includePaths = [
          productResolutions.res810x608,
          productResolutions.res810x810,
        ];
      } else {
        includePaths = [
          productResolutions.res1080x810,
          productResolutions.res1080x1080,
        ];
      }
      const found = product.images?.find((res) => {
        for (let i = 0; i < includePaths.length; i += 1) {
          if (includePaths[i] === res) {
            return true;
          }
        }
        return false;
      });
      if (found) {
        const imageDimensions = found.split('x');
        const width = parseInt(imageDimensions[0], 10);
        const height = parseInt(imageDimensions[1], 10);
        image.src = `/images/${product.id}/${found}.png`;
        image.width = width;
        image.height = height;
      }
      return image;
    };
    body = (
      <Box className={styles.body}>
        <Swiper
          className={styles.swiper}
          modules={[Pagination]}
          slidesPerView={1}
          loop
          pagination
        >
          {[1, 2, 3, 4, 5].map((_, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <SwiperSlide key={index} className={styles.slide}>
                <img
                  src={getPreferredImageSrc().src}
                  alt={product.name}
                  width={getPreferredImageSrc().width}
                  height={getPreferredImageSrc().height}
                  className={styles.image}
                  placeholder="blur"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className={styles.productDetails}>
          <div className={styles.productName}>{product.name}</div>
          <ProductPrice />
        </div>
        <ProductActions product={product} />
      </Box>
    );
  }

  return (
    <Box className={styles.layout}>
      <Header className={styles.header} showBackIcon />
      {body}
    </Box>
  );
}

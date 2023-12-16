import { Header } from '@/components';
import { Box, Dialog, DialogContent } from '@mui/material';
import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import {
  Add,
  CloseFullscreen,
  Fullscreen,
  Remove,
  RestartAlt,
} from '@mui/icons-material';
import Button from '@mui/material/Button';
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
  const mainSwiperRef = useRef<SwiperRef | null>(null);
  const setDialog = useSetRecoilState(selectedDialogAtom);

  const product =
    recoilProductLoadable.state === 'hasValue' && recoilProductLoadable.contents
      ? recoilProductLoadable.contents
      : undefined;

  const onImageClick = async (
    swiper: SwiperClass,
    _event: MouseEvent | TouchEvent | PointerEvent
  ) => {
    if (
      product &&
      product.images &&
      swiper.activeIndex < product.images.length
    ) {
      const open = true;
      setDialog(
        <Dialog
          open={open}
          onClose={() => {
            setDialog(null);
          }}
          fullScreen
          sx={{ overflowX: 'hidden' }}
        >
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyItems: 'center',
              padding: '0px',
            }}
          >
            <Swiper
              className={styles.swiperDialog}
              modules={[FreeMode, Navigation, Thumbs]}
              slidesPerView={1}
              navigation
              thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
              onClick={onImageClick}
              initialSlide={swiper.activeIndex}
              onSlideChange={(swiperInstance) => {
                if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
                  mainSwiperRef.current.swiper.slideTo(
                    swiperInstance.activeIndex
                  );
                }
              }}
            >
              {product.images.map((item) => {
                return (
                  <SwiperSlide key={item.url} className={styles.slideDialog}>
                    <TransformWrapper
                      initialScale={1}
                      initialPositionX={0}
                      initialPositionY={100}
                    >
                      {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '16px',
                            }}
                          >
                            <Button
                              variant="outlined"
                              onClick={() => zoomIn()}
                              sx={{ marginRight: '16px', minWidth: 0 }}
                            >
                              <Add />
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => zoomOut()}
                              sx={{ marginRight: '16px', minWidth: 0 }}
                            >
                              <Remove />
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => resetTransform()}
                              sx={{ marginRight: '16px', minWidth: 0 }}
                            >
                              <RestartAlt />
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                setDialog(null);
                              }}
                              sx={{
                                minWidth: 0,
                              }}
                            >
                              <CloseFullscreen />
                            </Button>
                          </Box>
                          <TransformComponent>
                            <img
                              src={item.url}
                              alt={recoilProductLoadable.contents.name}
                              className={styles.imageDialog}
                              placeholder="blur"
                            />
                          </TransformComponent>
                        </>
                      )}
                    </TransformWrapper>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </DialogContent>
        </Dialog>
      );
    }
  };

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
                onClick={onImageClick}
                ref={mainSwiperRef}
              >
                <Button
                  variant="outlined"
                  sx={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    minWidth: 0,
                  }}
                  size="small"
                >
                  <Fullscreen />
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    minWidth: 0,
                  }}
                  size="small"
                >
                  <Fullscreen />
                </Button>
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
                slidesPerView={3}
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

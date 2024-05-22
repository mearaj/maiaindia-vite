import { Header } from '@/components';
import { Box, Dialog, DialogContent } from '@mui/material';
import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { useParams } from 'react-router-dom';
import { useRef } from 'react';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import {
  Add,
  CloseFullscreen,
  Remove,
  RestartAlt,
  SearchTwoTone,
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import { loadable } from 'jotai/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { CompoundProduct } from '@/jotai/data/product';
import { compoundProductWithImagesSelector } from '@/jotai/families/products';
import LoadableComponent from '@/components/Layouts/JotailLoadableComponent';
import ProductPrice from '@/components/Product/Price';
import styles from './index.module.css';
import AddUpdateButton from '@/components/Buttons/AddUpdate';
import BuyButton from '@/components/Buttons/Buy';

export default function ProductDetailsPage() {
  const params = useParams();
  const compoundIDArr = ((params.id as string) ?? ' - ').split('-');
  const compoundID = {
    productID: compoundIDArr[0],
    variantID: compoundIDArr[1],
  };
  const productWithImagesLoadable = loadable(
    compoundProductWithImagesSelector(compoundID)
  );
  const productLoadable = useAtomValue(productWithImagesLoadable);

  const mainSwiperRef = useRef<SwiperRef | null>(null);
  const setDialog = useSetAtom(selectedDialogAtom);

  let data: CompoundProduct = {
    product: {
      id: '',
      categoryID: '',
      name: '',
      details: '',
      variants: [
        {
          id: '',
          productID: '',
          currency: 'INR',
          mrp: 0,
          sp: 0,
          images: [],
        },
      ],
    },
    variant: {
      id: '',
      productID: '',
      currency: 'INR',
      mrp: 0,
      sp: 0,
      images: [],
    },
  };
  if (productLoadable.state === 'hasData') {
    data = productLoadable.data;
  }

  const product =
    productLoadable.state === 'hasData' && productLoadable.data
      ? productLoadable.data
      : undefined;
  const onImageClick = async (
    swiper: SwiperClass,
    _event: MouseEvent | TouchEvent | PointerEvent
  ) => {
    if (
      product &&
      product.variant.images &&
      swiper.activeIndex < product.variant.images.length
    ) {
      const open = true;
      setDialog(
        <Dialog
          open={open}
          onClose={() => {
            setDialog(null);
          }}
          fullScreen
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  width: '100%',
                  position: 'fixed',
                  top: 0,
                }}
              >
                <Button
                  variant="outlined"
                  sx={{ marginRight: '16px', minWidth: 0 }}
                >
                  <Add />
                </Button>
                <Button
                  variant="outlined"
                  sx={{ marginRight: '16px', minWidth: 0 }}
                >
                  <Remove />
                </Button>
                <Button
                  variant="outlined"
                  sx={{ marginRight: '16px', minWidth: 0 }}
                >
                  <RestartAlt />
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: 0,
                  }}
                >
                  <CloseFullscreen />
                </Button>
              </Box>
              {product.variant.images.map((item) => {
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
                              width: '100%',
                              opacity: 0,
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
                              alt={data.product.name}
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
        <LoadableComponent
          loaderContainerStyle={{ height: '80vh', width: '100%' }}
          errorContainerStyle={{ height: '80vh', width: '100%' }}
          jotaiLoadable={productLoadable}
        >
          {product &&
            product.variant.images &&
            product.variant.images.length > 0 && (
              <Swiper
                className={styles.swiper}
                modules={[Pagination]}
                slidesPerView={1}
                onClick={onImageClick}
                ref={mainSwiperRef}
                pagination
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
                  <SearchTwoTone />
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
                  <SearchTwoTone />
                </Button>
                {product.variant.images.map((item) => {
                  return (
                    <SwiperSlide key={item.url} className={styles.slide}>
                      <img
                        src={item.url}
                        alt={data.product.name}
                        className={styles.image}
                        placeholder="blur"
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
        </LoadableComponent>
        {product && (
          <>
            <div className={styles.productDetails}>
              <div className={styles.productName}>{data.product.name}</div>
              <ProductPrice product={data.product} />
            </div>
            <Box sx={{ padding: '16px' }}>
              <Box sx={{ marginBottom: '8px' }}>
                <AddUpdateButton compoundProduct={data} />
              </Box>
              <BuyButton product={data.product} />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

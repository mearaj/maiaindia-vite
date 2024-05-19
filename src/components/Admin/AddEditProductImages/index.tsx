import { Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Delete, Download } from '@mui/icons-material';
import Button from '@mui/material/Button';
import {
  LocallyUploadedImage,
  ProductFormModeState,
  VariantImage,
} from '@/jotai/data/product';
import { useAtom } from 'jotai/index';
import { productFormStateAtom } from '@/jotai/atoms/productForm';
import styles from './index.module.css';
import addEditProductImagesPlaceholder from '@/images/placeholder.svg';

export default function AddEditProductImagesComponent() {
  const [productFormState, setProductFormState] = useAtom(productFormStateAtom);
  const { isProcessing, mode: formMode, productForm } = productFormState;

  return productForm.variants.map((variant) => {
    const filteredProductImages = (variant.images ?? []).filter(
      (eacImage) =>
        !variant.imagesForDeletion ??
        [].find(
          (imageToDelete: VariantImage) => imageToDelete.url === eacImage.url
        )
    );
    return (
      <Box className={styles.swiperContainer} key={variant.id!}>
        <Box sx={{ marginBottom: '16px' }}>
          <Box>Backend Images Count: {(variant.images ?? []).length}</Box>
          <Box>Local Images Count: {variant.localImages?.length ?? 0}</Box>
          <Box>
            Images For Deletion Count: {variant.imagesForDeletion?.length ?? 0}
          </Box>
        </Box>
        <Swiper
          className={styles.swiper}
          modules={[FreeMode, Navigation, Thumbs]}
          slidesPerView={1}
          navigation
        >
          {(filteredProductImages.length === 0 && variant.localImages) ??
          [].length === 0 ? (
            <SwiperSlide className={styles.slide}>
              <img
                src={addEditProductImagesPlaceholder}
                alt="Placeholder"
                className={styles.image}
                placeholder="blur"
              />
              <Box sx={{ textAlign: 'center' }}>Placeholder</Box>
            </SwiperSlide>
          ) : (
            <>
              {filteredProductImages.map((item) => (
                <SwiperSlide key={item.url} className={styles.slide}>
                  <img
                    src={item.url}
                    alt={item.name}
                    className={styles.image}
                    placeholder="blur"
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                      onClick={() => {
                        const newImagesForDeletion = [
                          ...(variant.imagesForDeletion ?? []),
                          item,
                        ];
                        const newVariants = [...productForm.variants];
                        for (const eachVariant of newVariants) {
                          if (eachVariant.id! === variant.id) {
                            eachVariant.imagesForDeletion =
                              newImagesForDeletion;
                            setProductFormState({
                              ...productFormState,
                              productForm: {
                                ...productForm,
                                variants: newVariants,
                              },
                            });
                            break;
                          }
                        }
                      }}
                      size="small"
                      fullWidth
                      startIcon={<Delete />}
                      disabled={
                        formMode === ProductFormModeState.read || isProcessing
                      }
                    >
                      Remove Backend Image
                    </Button>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        maxWidth: 'calc(100vw - 32px)',
                      }}
                    >
                      <Box
                        sx={{
                          textAlign: 'center',
                          lineHeight: '1',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.name}
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        component="a"
                        href={item.url}
                        download
                        sx={{ padding: '2px', minWidth: '40px' }}
                      >
                        <Download
                          sx={{
                            padding: '0px',
                            fontSize: '20px',
                            lineHeight: '1',
                          }}
                        />
                      </Button>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
              {variant.localImages ??
                [].map((item: LocallyUploadedImage) => (
                  <SwiperSlide key={item.url} className={styles.slide}>
                    <img
                      src={item.url}
                      alt={item.file.name}
                      className={styles.image}
                      placeholder="blur"
                    />
                    <Box>
                      <Button
                        onClick={() => {
                          const newLocalImages =
                            variant.localImages ??
                            [].filter(
                              (eachItem: LocallyUploadedImage) =>
                                eachItem.url !== item.url
                            );
                          URL.revokeObjectURL(item.url);
                          const newVariants = [...productForm.variants];
                          for (const eachVariant of newVariants) {
                            if (eachVariant.id! === variant.id) {
                              eachVariant.localImages = newLocalImages;
                              setProductFormState({
                                ...productFormState,
                                productForm: {
                                  ...productForm,
                                  variants: newVariants,
                                },
                              });
                              break;
                            }
                          }
                        }}
                        size="small"
                        fullWidth
                        startIcon={<Delete />}
                        disabled={
                          formMode === ProductFormModeState.read || isProcessing
                        }
                      >
                        Remove Local Image
                      </Button>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                          maxWidth: 'calc(100vw - 32px)',
                        }}
                      >
                        <Box
                          sx={{
                            textAlign: 'center',
                            lineHeight: '1',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.file.name}
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          component="a"
                          href={item.url}
                          download
                          sx={{ padding: '2px', minWidth: '40px' }}
                        >
                          <Download
                            sx={{
                              padding: '0px',
                              fontSize: '20px',
                              lineHeight: '1',
                            }}
                          />
                        </Button>
                      </Box>
                    </Box>
                  </SwiperSlide>
                ))}
            </>
          )}
        </Swiper>
      </Box>
    );
  });
}

import { Box } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import {
  productFormImagesForDeletionSelector,
  productFormImagesSelector,
  productFormLocalImagesSelector,
  productFormModeStateSelector,
  productFormProcessingStateSelector,
} from '@/recoil/selectors/productForm';
import { Delete, Download } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { ProductFormModeState } from '@/recoil/data/product';
import styles from './index.module.css';
import addEditProductImagesPlaceholder from '@/images/placeholder.svg';

export default function AddEditProductImagesComponent() {
  const productImages = useRecoilValue(productFormImagesSelector);
  const [localImages, setLocalImages] = useRecoilState(
    productFormLocalImagesSelector
  );
  const [imagesForDeletion, setImagesForDeletion] = useRecoilState(
    productFormImagesForDeletionSelector
  );
  const isProcessing = useRecoilValue(productFormProcessingStateSelector);
  const formMode = useRecoilValue(productFormModeStateSelector);

  const filteredProductImages = (productImages ?? []).filter(
    (eacImage) =>
      !imagesForDeletion.find(
        (imageToDelete) => imageToDelete.url === eacImage.url
      )
  );

  return (
    <Box className={styles.swiperContainer}>
      <Box sx={{ marginBottom: '16px' }}>
        <Box>Backend Images Count: {(productImages ?? []).length}</Box>
        <Box>Local Images Count: {localImages.length}</Box>
        <Box>Images For Deletion Count: {imagesForDeletion.length}</Box>
      </Box>
      <Swiper
        className={styles.swiper}
        modules={[FreeMode, Navigation, Thumbs]}
        slidesPerView={1}
        navigation
      >
        {filteredProductImages.length === 0 && localImages.length === 0 ? (
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
                      const newImagesForDeletion = [...imagesForDeletion, item];
                      setImagesForDeletion(newImagesForDeletion);
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
            {localImages.map((item) => (
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
                      const newLocalImages = localImages.filter(
                        (eachItem) => eachItem.url !== item.url
                      );
                      URL.revokeObjectURL(item.url);
                      setLocalImages(newLocalImages);
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
}

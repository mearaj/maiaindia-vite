import {
  Box,
  Button,
  FormControl,
  FormLabel,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Delete, Download } from '@mui/icons-material';
import {
  LocallyUploadedImage,
  ProductFormModeState,
  Variant,
  VariantImage,
} from '@/jotai/data/product';
import { useAtom } from 'jotai/index';
import { productFormStateAtom } from '@/jotai/atoms/productForm';
import cssStyles from '@/components/Admin/ProductDetails/AddEditVariant/index.module.css';
import { ChangeEvent, useCallback } from 'react';
import { isValidCSSColor } from '@/misc/color';
import addEditProductImagesPlaceholder from '@/images/placeholder.svg';
import createStyles from '@/components/Admin/ProductDetails/AddEditVariant/styles';

export default function AddEditVariantComponent({
  variant,
}: {
  variant: Variant;
}) {
  const [productFormState, setProductFormState] = useAtom(productFormStateAtom);
  const { isProcessing, mode: formMode, productForm } = productFormState;
  const theme = useTheme();
  const styles = createStyles(theme);
  const formLabelSx = styles.formLabel;
  const formControlStyle = styles.formControl;
  const filteredProductImages = (variant?.images ?? []).filter(
    (eacImage) =>
      !(variant.imagesForDeletion ?? []).find(
        (imageToDelete: VariantImage) => imageToDelete.url === eacImage.url
      )
  );
  const disableForm = isProcessing || formMode === ProductFormModeState.read;

  const handleVariantFieldChange = useCallback(
    (property: 'mrp' | 'sp' | 'size' | 'color') =>
      (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const valNum = parseInt(val, 10);
        const foundIndex = (productForm.variants ?? []).findIndex(
          (eachItem) => eachItem.id === variant.id
        );
        if (foundIndex >= 0) {
          switch (property) {
            case 'mrp':
              if (Number.isNaN(valNum)) {
                productForm.variants[foundIndex].mrp = null;
              } else {
                productForm.variants[foundIndex].mrp = valNum;
              }
              break;
            case 'sp':
              if (Number.isNaN(valNum)) {
                productForm.variants[foundIndex].sp = null;
              } else {
                productForm.variants[foundIndex].sp = valNum;
              }
              break;
            case 'size':
              productForm.variants[foundIndex].size = val;
              break;
            case 'color':
              productForm.variants[foundIndex].color = val;
              break;
            default:
              break;
          }
          setProductFormState({
            ...productFormState,
            productForm,
          });
        }
      },
    [productForm, productFormState, setProductFormState, variant.id]
  );

  return (
    <Box className={cssStyles.swiperContainer} key={variant.id!}>
      <h3>{variant.id}</h3>
      <FormControl fullWidth sx={formControlStyle}>
        <FormLabel sx={formLabelSx} htmlFor="variant-size">
          Size
        </FormLabel>
        <OutlinedInput
          id="variant-size"
          fullWidth
          placeholder="Enter variant size..."
          size="small"
          value={variant?.size ?? ''}
          onChange={handleVariantFieldChange('size')}
          disabled={disableForm}
        />
      </FormControl>
      <FormControl fullWidth sx={formControlStyle}>
        <FormLabel sx={formLabelSx} htmlFor="variant-color">
          Color
        </FormLabel>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <OutlinedInput
            id="variant-color"
            fullWidth
            placeholder="Enter variant color..."
            size="small"
            value={variant?.color ?? ''}
            onChange={handleVariantFieldChange('color')}
            disabled={disableForm}
            sx={{ marginRight: '8px' }}
          />
          <Button
            variant="outlined"
            type="button"
            sx={{
              height: '40px',
              width: '40px',
              minWidth: '0px',
              backgroundColor: isValidCSSColor(variant?.color ?? '')
                ? variant.color
                : 'transparent',
            }}
          />
        </Box>
      </FormControl>
      <FormControl fullWidth sx={formControlStyle}>
        <FormLabel sx={formLabelSx} htmlFor="variant-mrp">
          Max Retail Price&nbsp;*
        </FormLabel>
        <OutlinedInput
          type="number"
          id="variant-mrp"
          fullWidth
          placeholder="Enter max retail price..."
          size="small"
          value={variant?.mrp ?? ''}
          onChange={handleVariantFieldChange('mrp')}
          disabled={disableForm}
        />
      </FormControl>
      <FormControl fullWidth sx={formControlStyle}>
        <FormLabel sx={formLabelSx} htmlFor="variant-sp">
          Selling Price&nbsp;*
        </FormLabel>
        <OutlinedInput
          type="number"
          id="variant-sp"
          placeholder="Enter selling price..."
          fullWidth
          size="small"
          value={variant.sp ?? ''}
          onChange={handleVariantFieldChange('sp')}
          disabled={disableForm}
        />
      </FormControl>
      <Box sx={{ marginBottom: '16px' }}>
        <Box>Backend Images Count: {(variant.images ?? []).length}</Box>
        <Box>Local Images Count: {variant.localImages?.length ?? 0}</Box>
        <Box>
          Images For Deletion Count: {variant.imagesForDeletion?.length ?? 0}
        </Box>
      </Box>
      <Swiper
        className={cssStyles.swiper}
        modules={[FreeMode, Navigation, Thumbs]}
        slidesPerView={1}
        navigation
      >
        {filteredProductImages.length === 0 &&
        (variant.localImages ?? []).length === 0 ? (
          <SwiperSlide className={cssStyles.slide}>
            <img
              src={addEditProductImagesPlaceholder}
              alt="Placeholder"
              className={cssStyles.image}
              placeholder="blur"
            />
            <Box sx={{ textAlign: 'center' }}>Placeholder</Box>
          </SwiperSlide>
        ) : (
          <>
            {filteredProductImages.map((item) => (
              <SwiperSlide key={item.url} className={cssStyles.slide}>
                <img
                  src={item.url}
                  alt={item.name}
                  className={cssStyles.image}
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
                          eachVariant.imagesForDeletion = newImagesForDeletion;
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
            {(variant.localImages ?? []).map((item: LocallyUploadedImage) => {
              return (
                <SwiperSlide key={item.url} className={cssStyles.slide}>
                  <img
                    src={item.url}
                    alt={item.file.name}
                    className={cssStyles.image}
                    placeholder="blur"
                  />
                  <Box>
                    <Button
                      onClick={() => {
                        const newLocalImages = (
                          variant.localImages ?? []
                        ).filter(
                          (eachItem: LocallyUploadedImage) =>
                            eachItem.url !== item.url
                        );
                        URL.revokeObjectURL(item.url);
                        const uploadID = `${variant.id}-images-upload`;
                        const imgElm = document.getElementById(
                          uploadID
                        ) as HTMLInputElement;
                        if (imgElm) {
                          imgElm.value = '';
                        }
                        const foundIndex = (
                          productForm.variants ?? []
                        ).findIndex((eachItem) => eachItem.id === variant.id);
                        if (foundIndex >= 0) {
                          productForm.variants[foundIndex].localImages =
                            newLocalImages;
                        }
                        setProductFormState({
                          ...productFormState,
                          productForm,
                        });
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
              );
            })}
          </>
        )}
      </Swiper>
    </Box>
  );
}

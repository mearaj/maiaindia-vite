import {
  defaultPlaceholderImage,
  ImageMetadata,
  Product,
} from '@/store/data/data';
import { useCallback, useEffect, useRef } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import Close from '@mui/icons-material/Close';
import {
  selectHomeActiveProduct,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { setHomeActiveProduct } from '@/store/features/ui';
import ProductPrice from '@/components/Product/Price';
import ProductActions from '@/components/Product/Actions';
import ContentDrawer from '@/components/ContentDrawer';

export default function ProductItem({ product }: { product: Product }) {
  const cardContentReference = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const activeProductID = useAppSelector(selectHomeActiveProduct);

  const getPreferredImageSrc = (): ImageMetadata => {
    const image = { ...defaultPlaceholderImage };
    const images = [...(product.images ?? [])];
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i += 1) {
        images[i] = `/images/${product.id}/${images[i]}`;
      }
      image.src = images[images.length - 1];
      image.srcSet = images.join(',');
    }
    return image;
  };

  const onWindowClicked = useCallback(
    (ev: MouseEvent) => {
      if (cardContentReference && cardContentReference.current) {
        if (!ev.composedPath().includes(cardContentReference.current)) {
          if (activeProductID === product.id) {
            dispatch(setHomeActiveProduct(''));
          }
        }
      }
    },
    [activeProductID, dispatch, product.id]
  );
  useEffect(() => {
    window.addEventListener('click', onWindowClicked);
    return () => window.removeEventListener('click', onWindowClicked);
  }, [onWindowClicked]);

  return (
    <Paper
      ref={cardContentReference}
      elevation={activeProductID === product.id ? 8 : 1}
      sx={{
        padding: '0px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        onClick={(__) => {
          dispatch(setHomeActiveProduct(product.id));
        }}
        role="presentation"
      >
        <Box sx={{ flexGrow: 1 }}>
          <Box
            component="img"
            srcSet={getPreferredImageSrc().srcSet}
            src={getPreferredImageSrc().src}
            alt={product.name}
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'fill',
              objectPosition: 'center',
              marginBottom: '8px',
            }}
          />
        </Box>
        <br />
        <Box sx={{ padding: '4px 16px 16px' }}>
          <Box
            sx={{
              fontSize: '12px',
              lineHeight: 1.2,
              fontWeight: 500,
              marginBottom: '8px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.name}
          </Box>
          <ProductPrice />
        </Box>
      </Box>
      <ContentDrawer product={product}>
        <IconButton
          onClick={(_) => {
            dispatch(setHomeActiveProduct(''));
          }}
        >
          <Close />
        </IconButton>
        <ProductActions product={product} />
      </ContentDrawer>
    </Paper>
  );
}

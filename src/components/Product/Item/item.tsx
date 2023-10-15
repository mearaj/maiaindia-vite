import {
  defaultPlaceholderImage,
  ImageMetadata,
  Product,
} from '@/store/data/data';
import { useCallback, useEffect, useRef } from 'react';
import { Box, Card, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';
import { store, useAppDispatch } from '@/store';
import { setHomeActiveProduct } from '@/store/features/ui';
import ProductPrice from '@/components/Product/Price';
import ProductActions from '@/components/Product/Actions';
import ContentDrawer from '@/components/ContentDrawer';
import styles from './index.module.css';

export default function ProductItem({ product }: { product: Product }) {
  const cardContentReference = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

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
          const productID = store.getState().uiReducer.homeActiveProductID;
          if (productID === product.id) {
            dispatch(setHomeActiveProduct(''));
          }
        }
      }
    },
    [dispatch, product.id]
  );
  useEffect(() => {
    window.addEventListener('click', onWindowClicked);
    return () => window.removeEventListener('click', onWindowClicked);
  }, [onWindowClicked]);

  return (
    <Card
      ref={cardContentReference}
      sx={{
        padding: '0px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        borderRadius: 0,
      }}
    >
      <Card
        className={styles.cardBody}
        onClick={(__) => {
          dispatch(setHomeActiveProduct(product.id));
        }}
      >
        <Box className={styles.sectionTop}>
          <img
            srcSet={getPreferredImageSrc().srcSet}
            src={getPreferredImageSrc().src}
            alt={product.name}
            className={styles.img}
          />
        </Box>
        <br />
        <Box className={styles.sectionBottom}>
          <Box className={styles.productName}>{product.name}</Box>
          <ProductPrice />
        </Box>
      </Card>
      <ContentDrawer product={product}>
        <IconButton
          onClick={(_) => {
            dispatch(setHomeActiveProduct(''));
          }}
          className={styles.closeIconButton}
        >
          <Close className={styles.closeIcon} />
        </IconButton>
        <ProductActions product={product} />
      </ContentDrawer>
    </Card>
  );
}

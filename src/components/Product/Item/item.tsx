import {
  defaultPlaceholderImage,
  ImageMetadate,
  Product,
  productResolutions,
} from '@/store/data/data';
import { useCallback, useEffect, useRef } from 'react';
import { Box, Card, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';
import { store, useAppDispatch } from '@/store';
import { setHomeActiveProduct } from '@/store/features/ui';
import ProductPrice from '@/components/Product/Price';
import ProductActions from '@/components/Product/Actions';
import ContentDrawer from '@/components/ContentDrawer';
import useDimensions from '@/hooks/dimensions';
import styles from './index.module.css';

export default function ProductItem({ product }: { product: Product }) {
  const cardContentReference = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const dimensions = useDimensions();

  const getPreferredImageSrc = (): ImageMetadate => {
    const image = { ...defaultPlaceholderImage };
    let includePaths: string[] = [];
    if (dimensions.width < 600) {
      includePaths = [
        productResolutions.res270x203,
        productResolutions.res270x270,
      ];
    } else if (dimensions.width < 1100) {
      includePaths = [
        productResolutions.res540x405,
        productResolutions.res540x540,
      ];
    } else {
      includePaths = [
        productResolutions.res540x405,
        productResolutions.res540x540,
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
    <Card ref={cardContentReference} className={styles.card} key={product.id}>
      <Box
        className={styles.cardBody}
        onClick={(__) => {
          dispatch(setHomeActiveProduct(product.id));
        }}
      >
        <Box className={styles.sectionTop}>
          <img
            src={getPreferredImageSrc().src}
            alt={product.name}
            width={getPreferredImageSrc().width}
            height={getPreferredImageSrc().height}
            className={styles.img}
          />
        </Box>
        <Box className={styles.sectionBottom}>
          <Box className={styles.productName}>{product.name}</Box>
          <ProductPrice />
        </Box>
      </Box>
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

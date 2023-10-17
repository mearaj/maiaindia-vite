import { ImageMetadata, Product } from '@/store/data/data';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Paper, useTheme } from '@mui/material';
import ProductPrice from '@/components/Product/Price';
import ProductActions from '@/components/Product/Actions';
import ContentDrawer from '@/components/ContentDrawer';
import staticProducts from '@/assets/data/products_id';
import Placeholder from '@/icons/placeholder';

export default function ProductItem({ product }: { product: Product }) {
  const cardContentReference = useRef<HTMLDivElement>(null);
  const [activeProductID, setActiveProductID] = useState('');
  const theme = useTheme();
  const getPreferredImageSrc = (): ImageMetadata => {
    const image: ImageMetadata = {};
    const images = [...(product.images ?? [])];
    if (images && images.length > 0) {
      const found = staticProducts.find((p) => p === product.id);
      for (let i = 0; i < images.length; i += 1) {
        const dim = images[i].match(/(\d+[xX]\d+)/);
        if (dim && dim?.length > 0) {
          const dims = dim[0].split(/[xX]/);
          if (dims.length > 0) {
            if (found) {
              images[i] = `/images/${product.id}/${images[i]} ${dims[0]}w`;
            } else {
              images[
                i
              ] = `https://firebasestorage.googleapis.com/v0/b/maiaindia.appspot.com/o/images%2F${product.id}%2F${images[i]}?alt=media ${dims[0]}w`;
            }
          }
        }
      }
      [image.src] = images[images.length - 1].split(' ');
      image.srcSet = images.join(',');
    }
    return image;
  };

  const onWindowClicked = useCallback(
    (ev: MouseEvent) => {
      if (cardContentReference && cardContentReference.current) {
        if (
          !ev.composedPath().includes(cardContentReference.current) &&
          activeProductID === product.id
        ) {
          setActiveProductID('');
        }
      }
    },
    [activeProductID, product.id]
  );
  useEffect(() => {
    window.addEventListener('click', onWindowClicked);
    return () => window.removeEventListener('click', onWindowClicked);
  }, [onWindowClicked]);

  return (
    <Paper
      ref={cardContentReference}
      sx={{
        padding: '0px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 0,
        boxShadow: activeProductID === product.id ? 24 : 1,
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
          setActiveProductID(product.id);
        }}
        role="presentation"
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          {!getPreferredImageSrc().srcSet ? (
            <Placeholder
              height="auto"
              width="100%"
              fillOne={theme.palette.primary.light}
            />
          ) : (
            <Box
              component="img"
              srcSet={getPreferredImageSrc().srcSet}
              src={getPreferredImageSrc().src}
              alt={product.name}
              sx={{
                height: 'auto',
                width: '100%',
                objectFit: 'fill',
                objectPosition: 'center',
                marginBottom: '8px',
              }}
            />
          )}
        </Box>
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
      <ContentDrawer
        product={product}
        activeProductID={activeProductID}
        setActiveProductID={setActiveProductID}
      >
        <ProductActions product={product} />
      </ContentDrawer>
    </Paper>
  );
}

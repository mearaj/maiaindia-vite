import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Paper, useTheme } from '@mui/material';
import { Product } from '@/data/store';
import getPreferredImageSrc from '@/misc';
import ProductActions from '@/components/Product/Actions';
import ProductPrice from '@/components/Product/Price';
import ContentDrawer from '@/components/ContentDrawer';
import Placeholder from '@/icons/placeholder';

export default function ProductComponent({ product }: { product: Product }) {
  const cardContentReference = useRef<HTMLDivElement>(null);
  const [activeProductID, setActiveProductID] = useState('');
  const theme = useTheme();

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

  const preferredImgSrc = getPreferredImageSrc(product);

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
          {!preferredImgSrc.srcSet ? (
            <Placeholder
              style={{
                height: 'auto',
                width: '100%',
                backgroundColor: theme.palette.primary.light,
              }}
              fillOne={theme.palette.primary.light}
            />
          ) : (
            <Box
              component="img"
              srcSet={preferredImgSrc.srcSet}
              src={preferredImgSrc.src}
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
        <Box sx={{ padding: '4px 8px 4px' }}>
          <Box
            sx={{
              fontSize: '14px',
              lineHeight: 1,
              marginBottom: '4px',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.name}
          </Box>
          <ProductPrice product={product} />
        </Box>
      </Box>
      <ContentDrawer
        product={product}
        activeProductID={activeProductID}
        setActiveProductID={setActiveProductID}
      >
        <ProductActions product={product} sx={{ height: '100%' }} />
      </ContentDrawer>
    </Paper>
  );
}

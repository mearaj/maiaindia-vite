import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Paper, useTheme } from '@mui/material';
import getPreferredImageSrc from '@/misc';
import { useRecoilValue } from 'recoil';
import { cartAtom } from '@/recoil/atoms/cart';
import { Product } from '@/recoil/data/product';
import ProductActions from '@/components/Product/Actions';
import ProductPrice from '@/components/Product/Price';
import ContentDrawer from '@/components/ContentDrawer';

export default function ProductComponent({ product }: { product: Product }) {
  const cardContentReference = useRef<HTMLDivElement>(null);
  const [activeProductID, setActiveProductID] = useState('');
  const theme = useTheme();
  const cart = useRecoilValue(cartAtom);

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
        overflowX: 'hidden',
        overflowY: 'auto',
        borderRadius: 0,
        boxShadow: activeProductID === product.id ? 24 : 1,
        minHeight: '200px',
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
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: '16px',
          }}
        >
          <Box
            component="img"
            src={preferredImgSrc[0].src}
            alt={product.name}
            height={preferredImgSrc[0].height}
            width={preferredImgSrc[0].width}
            sx={{
              height: 'auto',
              width: '100%',
              maxHeight: '170px',
              maxWidth: '100%',
              objectFit: 'fill',
              objectPosition: 'center',
              marginBottom: '4px',
            }}
          />
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
      {cart.items &&
        cart.items[product.id] &&
        cart.items[product.id].quantity > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '0px',
              right: '0px',
              backgroundColor: theme.palette.primary.main,
              // borderRadius: '50%',
              lineHeight: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.primary.contrastText,
              height: '20px',
              width: '20px',
            }}
          >
            {cart.items[product.id].quantity}
          </Box>
        )}
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

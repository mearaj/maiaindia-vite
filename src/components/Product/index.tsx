import { ReactNode, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import { useRecoilValueLoadable } from 'recoil';
import { Product } from '@/recoil/data/product';
import { imagesByProductIDSelector } from '@/recoil/selectors/products';
import { Loader } from '@/components';
import { useNavigate } from 'react-router-dom';
import ProductPrice from '@/components/Product/Price';
import AddUpdateButton from '@/components/Buttons/AddUpdate';

export default function ProductComponent({ product }: { product: Product }) {
  const cardContentReference = useRef<HTMLDivElement>(null);
  const { contents: preferredImgSrc, state: imagesState } =
    useRecoilValueLoadable(imagesByProductIDSelector(product.id));
  const navigate = useNavigate();

  let imageComponent: ReactNode;
  if (imagesState === 'loading') {
    imageComponent = (
      <Box
        sx={{
          height: 'auto',
          width: '100%',
          maxHeight: '170px',
          maxWidth: '100%',
          marginBottom: '4px',
        }}
      >
        <Loader />
      </Box>
    );
  } else {
    imageComponent = (
      <Box
        component="img"
        src={preferredImgSrc[0]}
        alt={product.name}
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
    );
  }

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
        boxShadow: 1,
        minHeight: '200px',
        '&:active,&:hover': {
          boxShadow: 24,
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          onClick={() => {
            navigate(`/products/${product.id}`);
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
            {imageComponent}
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
        <Box sx={{ padding: '0px 8px' }}>
          <AddUpdateButton product={product} />
        </Box>
      </Box>
    </Paper>
  );
}

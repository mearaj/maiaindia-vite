import { Box, Typography, useTheme } from '@mui/material';
import { productIdSelector } from '@/jotai/atoms/productId';
import {
  defaultPlaceholderProductImage,
  Product,
  ProductImage,
} from '@/jotai/data/product';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { Add, Remove } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import LoadableComponent from '@/components/Layouts/JotailLoadableComponent';
import RemoveButton from '@/components/Buttons/Remove';
import { useAddUpdateCartEffect } from '@/hooks/useAddUpdateCartEffect';

function CartItemInnerComponent({
  product,
  image,
}: {
  product: Product;
  image: ProductImage;
}) {
  const theme = useTheme();
  const { handleCartIncrement, onDecrementClicked, quantity, loading } =
    useAddUpdateCartEffect({ product });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component="img"
          src={image.url}
          alt={product.name}
          sx={{
            height: 'auto',
            width: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            marginBottom: '16px',
          }}
        />
        <RemoveButton
          product={product}
          variant="contained"
          sx={{ marginBottom: '0px', padding: '6px' }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'stretch',
        }}
      >
        <Box>
          <Box sx={{ marginBottom: '0' }}>{product.name}</Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '36.5px',
            padding: '3px 4px',
            border: `1px solid ${theme.palette.primary.main}`,
          }}
        >
          <Remove onClick={onDecrementClicked} sx={{ fontSize: '20px' }} />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0px 2px',
            }}
          >
            {loading ? (
              <CircularProgress
                sx={{
                  height: '24px',
                  width: '24px',
                  maxWidth: '24px',
                  maxHeight: '24px',
                }}
              />
            ) : (
              <Box
                sx={{
                  minWidth: '24px',
                  minHeight: '24px',
                  textAlign: 'center',
                }}
              >
                {quantity}
              </Box>
            )}
          </Box>
          <Add onClick={handleCartIncrement} sx={{ fontSize: '20px' }} />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexDirection: 'column',
          lineHeight: 1,
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Typography
              sx={{
                fontWeight: '600',
                fontSize: '18px',
                wordBreak: 'break-word',
                textAlign: 'end',
              }}
            >
              ₹{product.variants[0]?.sp}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Typography
              component="s"
              sx={{
                fontSize: '12px',
                opacity: 0.75,
                wordBreak: 'break-word',
                textAlign: 'end',
              }}
            >
              ₹{product.variants[0]?.mrp}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontWeight: '600',
              fontSize: '18px',
              wordBreak: 'break-word',
              textAlign: 'end',
            }}
          >
            ₹{((product.variants[0]?.sp ?? 0) * quantity).toFixed(0)}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

interface CartItemComponentProps {
  productId: string;
}

export default function CartItemComponent({
  productId,
}: CartItemComponentProps) {
  const productWithImagesLoadable = loadable(productIdSelector(productId));
  const productIDLoadable = useAtomValue(productWithImagesLoadable);
  const product =
    productIDLoadable.state === 'hasData' && productIDLoadable.data
      ? productIDLoadable.data
      : null;
  const preferredImgSrc =
    product &&
    product.images &&
    product.images.length > 0 &&
    productIDLoadable.state !== 'loading' &&
    productIDLoadable.state === 'hasData'
      ? productIDLoadable.data.images[0]
      : defaultPlaceholderProductImage;

  const defaultLoaderStyle = {
    minHeight: '198px',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: product ? '1fr 1fr 1fr' : '1fr',
        gridColumnGap: '8px',
        marginBottom: '48px',
      }}
    >
      <LoadableComponent
        loaderContainerStyle={defaultLoaderStyle}
        errorContainerStyle={defaultLoaderStyle}
        jotaiLoadable={productIDLoadable}
      >
        {product && preferredImgSrc && (
          <CartItemInnerComponent product={product} image={preferredImgSrc} />
        )}
      </LoadableComponent>
    </Box>
  );
}

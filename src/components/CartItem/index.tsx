import { Box, Typography, useTheme } from '@mui/material';
import {
  CompoundID,
  CompoundProduct,
  defaultPlaceholderProductImage,
  VariantImage,
} from '@/jotai/data/product';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { Add, Remove } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { compoundProductWithImagesSelector } from '@/jotai/families/products';
import RemoveButton from '@/components/Buttons/Remove';
import { useAddUpdateCartEffect } from '@/hooks/useAddUpdateCartEffect';

function CartItemInnerComponent({
  compoundProduct,
  image,
}: {
  compoundProduct: CompoundProduct;
  image: VariantImage;
}) {
  const theme = useTheme();
  const { handleCartIncrement, onDecrementClicked, quantity, loading } =
    useAddUpdateCartEffect({
      compoundID: `${compoundProduct.product.id}-${compoundProduct.variant.id}`,
    });
  const { product } = compoundProduct;

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
          compoundProduct={compoundProduct}
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
  compoundID: CompoundID;
}

export default function CartItemComponent({
  compoundID,
}: CartItemComponentProps) {
  const productWithImagesLoadable = loadable(
    compoundProductWithImagesSelector(compoundID)
  );
  const productIDLoadable = useAtomValue(productWithImagesLoadable);
  const product =
    productIDLoadable.state === 'hasData' && productIDLoadable.data
      ? productIDLoadable.data
      : null;
  const preferredImgSrc =
    product &&
    product.variant.images &&
    product.variant.images.length > 0 &&
    productIDLoadable.state !== 'loading' &&
    productIDLoadable.state === 'hasData' &&
    productIDLoadable.data.variant &&
    productIDLoadable.data.variant.images
      ? productIDLoadable.data?.variant?.images[0]!
      : defaultPlaceholderProductImage;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: product ? '1fr 1fr 1fr' : '1fr',
        gridColumnGap: '8px',
        marginBottom: '48px',
      }}
    >
      {product && preferredImgSrc && (
        <CartItemInnerComponent
          compoundProduct={product}
          image={preferredImgSrc}
        />
      )}
    </Box>
  );
}

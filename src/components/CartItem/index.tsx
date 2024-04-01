import { Box, Card } from '@mui/material';
import { productIdSelector } from '@/jotai/atoms/productId';
import { defaultPlaceholderProductImage } from '@/jotai/data/product';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import LoadableComponent from '@/components/Layouts/JotailLoadableComponent';
import ProductPrice from '@/components/Product/Price';
import AddUpdateButton from '@/components/Buttons/AddUpdate';
import RemoveButton from '@/components/Buttons/Remove';

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
    <Card
      sx={{
        display: 'grid',
        gridTemplateColumns: product ? '1fr 1fr' : '1fr',
        gridColumnGap: '8px',
        marginBottom: '16px',
        padding: '8px',
      }}
    >
      <LoadableComponent
        loaderContainerStyle={defaultLoaderStyle}
        errorContainerStyle={defaultLoaderStyle}
        jotaiLoadable={productIDLoadable}
      >
        {product && preferredImgSrc && (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'space-between',
              }}
            >
              <Box
                component="img"
                src={preferredImgSrc.url}
                alt={product.name}
                sx={{
                  height: 'auto',
                  width: '100%',
                  objectFit: 'fill',
                  objectPosition: 'center',
                  marginBottom: '16px',
                }}
              />
              <AddUpdateButton product={product} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'stretch',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ marginBottom: '0' }}>{product.name}</Box>
                <ProductPrice sx={{ marginBottom: '4px' }} product={product} />
              </Box>
              <Box
                sx={{
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <RemoveButton
                  product={product}
                  variant="text"
                  sx={{ marginBottom: '0px', height: '34px' }}
                />
              </Box>
            </Box>
          </>
        )}
      </LoadableComponent>
    </Card>
  );
}

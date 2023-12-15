import { Box, Card } from '@mui/material';
import { useRecoilValueLoadable } from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import { defaultPlaceholderProductImage } from '@/recoil/data/product';
import ProductPrice from '@/components/Product/Price';
import AddUpdateButton from '@/components/Buttons/AddUpdate';
import RemoveButton from '@/components/Buttons/Remove';
import RecoilLoadableComponent from '@/components/Layouts/RecoilLoadableComponent';

interface CartItemComponentProps {
  productId: string;
}

export default function CartItemComponent({
  productId,
}: CartItemComponentProps) {
  const productIDLoadable = useRecoilValueLoadable(
    productIdSelector(productId)
  );

  const product =
    productIDLoadable.state === 'hasValue' && productIDLoadable.contents
      ? productIDLoadable.contents
      : null;
  const preferredImgSrc =
    product && product.images && product.images.length > 0
      ? productIDLoadable.contents.images[0]
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
      <RecoilLoadableComponent
        loaderContainerStyle={defaultLoaderStyle}
        errorContainerStyle={defaultLoaderStyle}
        recoilLoadable={productIDLoadable}
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
              }}
            >
              <Box>
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
                  sx={{ marginBottom: '8px', height: '34px' }}
                />
              </Box>
            </Box>
          </>
        )}
      </RecoilLoadableComponent>
    </Card>
  );
}

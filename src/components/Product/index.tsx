import { Box, Paper } from '@mui/material';
import { defaultPlaceholderProductImage, Product } from '@/jotai/data/product';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai/index';
import { loadable } from 'jotai/utils';
import { compoundProductWithImagesSelector } from '@/jotai/families/products';
import ProductPrice from '@/components/Product/Price';
import AddUpdateButton from '@/components/Buttons/AddUpdate';
import { appAbsoluteRoutes } from '@/Router';
import LoadableComponent from '@/components/Layouts/JotailLoadableComponent';

export default function ProductComponent({
  product,
  isAdminProduct = false,
}: {
  product: Product;
  isAdminProduct: boolean;
}) {
  const navigate = useNavigate();
  const productWithImages = useAtomValue(
    loadable(
      compoundProductWithImagesSelector({
        productID: product.id!,
        variantID: product.activeVariant!.id,
      })
    )
  );
  const preferredImgSrc =
    productWithImages.state === 'hasData' &&
    productWithImages.data &&
    productWithImages.data.variant &&
    productWithImages.data.variant.images &&
    productWithImages.data.variant.images.length > 0
      ? productWithImages.data.variant.images[0]
      : defaultPlaceholderProductImage;
  const imageStyle = {
    height: 'auto',
    width: '100%',
    maxHeight: '170px',
    maxWidth: '100%',
    objectFit: 'fill',
    objectPosition: 'center',
    marginBottom: '4px',
  };

  return (
    <Paper
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
            if (isAdminProduct) {
              navigate(`${appAbsoluteRoutes.adminProducts}/${product.id}`);
            } else {
              navigate(`/products/${product.id}-${product.activeVariant!.id}`);
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '16px',
            }}
          >
            <LoadableComponent
              errorContainerStyle={imageStyle}
              loaderContainerStyle={imageStyle}
              jotaiLoadable={productWithImages}
            >
              <Box
                component="img"
                src={preferredImgSrc.url}
                alt={product.activeVariant!.id}
                sx={imageStyle}
              />
            </LoadableComponent>
          </Box>
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
              textAlign: 'center',
            }}
          >
            {product.name}
          </Box>
          <ProductPrice product={product} />
          {!isAdminProduct && (
            <Box sx={{ padding: '0px 8px' }}>
              <AddUpdateButton
                compoundProduct={{ product, variant: product.activeVariant! }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

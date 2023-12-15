import { Box, Paper } from '@mui/material';
import { defaultPlaceholderProductImage, Product } from '@/recoil/data/product';
import { useNavigate } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import ProductPrice from '@/components/Product/Price';
import AddUpdateButton from '@/components/Buttons/AddUpdate';
import RecoilLoadableComponent from '@/components/Layouts/RecoilLoadableComponent';
import { appAbsoluteRoutes } from '@/Router';

export default function ProductComponent({
  product,
  isAdminProduct = false,
}: {
  product: Product;
  isAdminProduct: boolean;
}) {
  const navigate = useNavigate();
  const productWithImages = useRecoilValueLoadable(
    productIdSelector(product.id!)
  );

  const preferredImgSrc =
    productWithImages.state === 'hasValue' &&
    productWithImages.contents &&
    productWithImages.contents.images &&
    productWithImages.contents.images.length > 0
      ? productWithImages.contents.images[0]
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
              navigate(`/products/${product.id}`);
            }
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
            <RecoilLoadableComponent
              errorContainerStyle={imageStyle}
              loaderContainerStyle={imageStyle}
              recoilLoadable={productWithImages}
            >
              <Box
                component="img"
                src={preferredImgSrc.url}
                alt={product.name}
                sx={imageStyle}
              />
            </RecoilLoadableComponent>
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
          </Box>
        </Box>
        {!isAdminProduct && (
          <Box sx={{ padding: '0px 8px' }}>
            <AddUpdateButton product={product} />
          </Box>
        )}
      </Box>
    </Paper>
  );
}

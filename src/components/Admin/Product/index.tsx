import { Box, Paper } from '@mui/material';
import { useRecoilValueLoadable } from 'recoil';
import { Product, ProductImage } from '@/recoil/data/product';
import { imagesByProductIDSelector } from '@/recoil/selectors/products';
import { useNavigate } from 'react-router-dom';
import placeholderImage from '@/assets/images/placeholder.svg';
import ProductPrice from '@/components/Product/Price';
import { appAbsoluteRoutes } from '@/Router';
import RecoilLoadableComponent from '@/components/Layouts/RecoilLoadableComponent';

export default function AdminProductComponent({
  product,
}: {
  product: Product;
}) {
  const navigate = useNavigate();
  const recoilValueLoadable = useRecoilValueLoadable(
    imagesByProductIDSelector(product.id)
  );

  const preferredImgSrc: ProductImage =
    recoilValueLoadable.state === 'hasValue' &&
    recoilValueLoadable.contents &&
    recoilValueLoadable.contents.length > 0
      ? recoilValueLoadable.contents[0]
      : { name: 'Placeholder', url: placeholderImage };
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
        '&:hover': {
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
        onClick={(__) => {
          navigate(`${appAbsoluteRoutes.adminProducts}/${product.id}`);
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
            recoilLoadable={recoilValueLoadable}
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
            }}
          >
            {product.name}
          </Box>
          <ProductPrice product={product} />
        </Box>
      </Box>
    </Paper>
  );
}

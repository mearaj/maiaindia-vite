import { Box, Button, Paper, useTheme } from '@mui/material';
import { defaultPlaceholderProductImage, Product } from '@/jotai/data/product';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai/index';
import { loadable } from 'jotai/utils';
import { compoundProductWithImagesSelector } from '@/jotai/families/products';
import { TableChart } from '@mui/icons-material';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import ProductPrice from '@/components/Product/Price';
import AddUpdateButton from '@/components/Buttons/AddUpdate';
import { appAbsoluteRoutes } from '@/Router';
import LoadableComponent from '@/components/Layouts/JotailLoadableComponent';
import RingSizesDialog from '@/components/Dialogs/RingSizesDialog';

export default function ProductComponent({
  product,
  isAdminProduct = false,
}: {
  product: Product;
  isAdminProduct: boolean;
}) {
  const navigate = useNavigate();
  const setActiveDialog = useSetAtom(selectedDialogAtom);
  const theme = useTheme();
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

  const sizes: string[] = product.variants
    .filter(
      (variant, index) =>
        !!variant.size &&
        index ===
          product.variants.findIndex(
            (variantAlt) => variantAlt.size === variant.size
          )
    )
    .map((variant) => variant.size) as string[];

  const colors: string[] = product.variants
    .filter(
      (variant, index) =>
        !!variant.color &&
        index ===
          product.variants.findIndex(
            (variantAlt) => variantAlt.color === variant.color
          )
    )
    .map((variant) => variant.color) as string[];

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
        <Box sx={{ padding: '4px 8px' }}>
          {sizes.length > 0 && (
            <Box sx={{ padding: '4px 0px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', marginRight: '4px' }}>Size</Box>
                <Button
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0px',
                    margin: '2px',
                    fontSize: '14px',
                    minWidth: '0',
                    textTransform: 'none',
                  }}
                  onClick={() => {
                    setActiveDialog(<RingSizesDialog />);
                  }}
                >
                  (<Box sx={{ display: 'flex', marginRight: '4px' }}>Chart</Box>
                  <TableChart sx={{ fontSize: '14px' }} />)
                </Button>
              </Box>
              {sizes.map((size) => {
                return (
                  <Button
                    sx={{
                      height: '20px',
                      lineHeight: '20px',
                      width: '20px',
                      minWidth: '0px',
                      padding: '0px',
                      margin: '2px',
                      fontWeight: 'bold',
                      backgroundColor:
                        size === product.activeVariant?.size
                          ? theme.palette.primary.dark
                          : 'transparent',
                      color:
                        size === product.activeVariant?.size
                          ? theme.palette.primary.contrastText
                          : theme.palette.primary.dark,
                      '&:active,&:hover,&:focus': {
                        backgroundColor:
                          size === product.activeVariant?.size
                            ? theme.palette.primary.dark
                            : 'transparent',
                        color:
                          size === product.activeVariant?.size
                            ? theme.palette.primary.contrastText
                            : theme.palette.primary.dark,
                      },
                    }}
                    key={size}
                  >
                    {size}
                  </Button>
                );
              })}
            </Box>
          )}
          {colors.length > 0 && (
            <Box sx={{ marginBottom: '4px' }}>
              <Box
                sx={{
                  display: 'flex',
                  textTransform: 'capitalize',
                }}
              >
                Color:&nbsp;{product.activeVariant?.color}
              </Box>
              {colors.map((color) => {
                return (
                  <Button
                    variant="outlined"
                    sx={{
                      height: '20px',
                      width: '20px',
                      padding: '0px',
                      minWidth: '0px',
                      margin: '2px',
                      backgroundColor: color,
                      boxSizing: 'border-box',
                      borderWidth: '3px',
                      color,
                      borderColor:
                        color === product.activeVariant?.color
                          ? theme.palette.primary.light
                          : 'transparent',
                      '&:active,&:hover,&:focus': {
                        backgroundColor: color,
                      },
                    }}
                    key={color}
                  />
                );
              })}
            </Box>
          )}
          {!isAdminProduct && (
            <Box sx={{ padding: '0px' }}>
              <AddUpdateButton
                compoundID={`${product.id}-${product.activeVariant?.id}`}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

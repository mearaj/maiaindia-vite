import { Box, Card } from '@mui/material';
import { useRecoilValueLoadable } from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import { Loader } from '@/components';
import { Product } from '@/recoil/data/product';
import { imagesByProductIDSelector } from '@/recoil/selectors/products';
import { ReactNode } from 'react';
import ProductPrice from '@/components/Product/Price';
import AddUpdateButton from '@/components/Buttons/AddUpdate';
import RemoveButton from '@/components/Buttons/Remove';

interface CartItemComponentProps {
  productId: string;
}

export default function CartItemComponent({
  productId,
}: CartItemComponentProps) {
  const productIDLoadable = useRecoilValueLoadable(
    productIdSelector(productId)
  );
  const { contents, state } = productIDLoadable;
  const { contents: preferredImgSrc, state: imagesState } =
    useRecoilValueLoadable(imagesByProductIDSelector(productId));

  if (state === 'hasError') {
    return <Box>{contents?.message ?? 'Unknown error'}</Box>;
  }

  if (state === 'loading') {
    return <Loader />;
  }
  const product = contents as Product;
  if (!product) {
    return <Box>Product couldn&apos;t be fetched</Box>;
  }

  let imageComponent: ReactNode;
  if (imagesState === 'loading') {
    imageComponent = (
      <Box
        sx={{
          height: 'auto',
          width: '100%',
          marginBottom: '16px',
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
          objectFit: 'fill',
          objectPosition: 'center',
          marginBottom: '16px',
        }}
      />
    );
  }

  return (
    <Card
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridColumnGap: '8px',
        marginBottom: '16px',
        padding: '8px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'space-between',
        }}
      >
        {imageComponent}
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
    </Card>
  );
}

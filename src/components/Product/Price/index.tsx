import { Box, SxProps, Theme, Typography } from '@mui/material';

import { Product } from '@/jotai/data/product';
import { ReactNode } from 'react';

export default function ProductPrice({
  sx,
  product,
}: {
  sx?: SxProps<Theme>;
  product: Product;
}) {
  let discountComponent: ReactNode;
  const discount =
    (product.variants[0]?.mrp || 0) - (product.variants[0]?.sp || 0);
  if (discount > 0 && product.variants && product.variants[0].mrp !== 0) {
    const discountPercentage = (
      (discount / product.variants[0].mrp) *
      100
    ).toFixed(0);
    discountComponent = (
      <Typography
        sx={{
          fontWeight: 600,
          marginRight: '6px',
          fontSize: 'inherit',
        }}
        color="primary"
        noWrap
      >
        {discountPercentage}% off
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        fontSize: '14px',
        display: 'flex',
        textAlign: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        ...sx,
      }}
    >
      {discountComponent}
      <Typography
        component="s"
        sx={{
          fontSize: 'inherit',
          marginRight: '6px',
          opacity: 0.75,
        }}
      >
        ₹{product.variants[0]?.mrp}
      </Typography>
      <Typography
        sx={{ fontWeight: '600', fontSize: 'inherit', marginRight: '6px' }}
      >
        ₹{product.variants[0]?.sp}
      </Typography>
    </Box>
  );
}

import { Box, SxProps, Theme } from '@mui/material';
import { Product } from '@/data/store';

export default function ProductPrice({
  sx,
  product,
}: {
  sx?: SxProps<Theme>;
  product: Product;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        fontSize: '12px',
        alignItems: 'center',
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            fontSize: '12px',
          }}
        >
          ₹
        </Box>
        <Box
          sx={{
            fontSize: '20px',
            fontWeight: '600',
          }}
        >
          {product.price.sp}&nbsp;
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Box
          sx={{
            fontSize: '12px',
            fontWeight: '300',
          }}
        >
          M.R.P.&nbsp;
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ fontSize: '12px' }}>₹</Box>
          <Box
            sx={{
              fontSize: '12px',
              fontWeight: 300,
            }}
          >
            {product.price.mrp}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

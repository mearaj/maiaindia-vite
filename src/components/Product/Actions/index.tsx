import { Box, SxProps, Theme } from '@mui/material';
import { Product } from '@/firebase/product';
import AddUpdateButton from '@/components/Buttons/AddUpdate';
import BuyButton from '@/components/Buttons/Buy';
import DetailsButton from '@/components/Buttons/Details';

interface ProductActionProps {
  product: Product;
  sx?: SxProps<Theme>;
}

export default function ProductActions({ product, sx }: ProductActionProps) {
  const buttonStyle = {
    fontWeight: 'bold',
    padding: '4px',
    minHeight: '42px',
    marginBottom: '16px',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '0 12px',
        flexGrow: 1,
        flexShrink: 0,
        minHeight: '100%',
        ...sx,
      }}
    >
      <DetailsButton product={product} />
      <AddUpdateButton product={product} sxAddButton={buttonStyle} />
      <BuyButton
        product={product}
        sx={{ ...buttonStyle, marginBottom: '0px' }}
      />
    </Box>
  );
}

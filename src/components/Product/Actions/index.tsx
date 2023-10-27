import { Box, Button, SxProps, Theme } from '@mui/material';
import AddToCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate, useParams } from 'react-router-dom';
import { Product } from '@/recoil/data/product';
import Element = React.JSX.Element;

interface ProductActionProps {
  product: Product;
  sx?: SxProps<Theme>;
}

export default function ProductActions({ product, sx }: ProductActionProps) {
  const params = useParams();
  const navigate = useNavigate();
  let button: Element | null = null;
  const buttonStyle = {
    fontWeight: 'bold',
    padding: '4px',
    minHeight: '40px',
    marginBottom: '16px',
    boxSizing: 'border-box',
  };
  if (params.id !== product.id) {
    button = (
      <Button
        sx={buttonStyle}
        variant="outlined"
        fullWidth
        // href={`/products/${product.id}`}
        onClick={(_) => {
          navigate(`/products/${product.id}`);
        }}
      >
        Details
      </Button>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '16px 12px',
        ...sx,
      }}
    >
      {button}
      <Button
        sx={{
          ...buttonStyle,
        }}
        variant="outlined"
        fullWidth
        onClick={(__) => {}}
      >
        <AddToCartIcon
          sx={{
            height: '32px',
            width: 'auto',
            marginRight: '4px',
          }}
        />
        <Box sx={{ fontSize: '16px' }}>Add</Box>
      </Button>
      <Button
        sx={{ ...buttonStyle, marginBottom: 0 }}
        variant="outlined"
        fullWidth
        onClick={() => {}}
      >
        <Box sx={{ fontSize: '16px' }}>Buy</Box>
      </Button>
    </Box>
  );
}

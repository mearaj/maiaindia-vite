import { Box, Button } from '@mui/material';
import { Product } from '@/store/data/data';
import AddToCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate, useParams } from 'react-router-dom';
import Element = React.JSX.Element;

export default function ProductActions({ product }: { product: Product }) {
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
        variant="contained"
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
        justifyContent: 'space-between',
        flexDirection: 'column',
        padding: '0 12px',
      }}
    >
      {button}
      <Button
        sx={{
          ...buttonStyle,
          '&:hover': {
            color: 'inherit',
            backgroundColor: 'inherit',
          },
        }}
        variant="contained"
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
      <Button sx={buttonStyle} variant="contained" fullWidth onClick={() => {}}>
        <Box sx={{ fontSize: '16px' }}>Buy</Box>
      </Button>
    </Box>
  );
}

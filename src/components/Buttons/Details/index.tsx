import { Button, Link, SxProps, Theme } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';

import { Product } from '@/firebase/product';

interface ProductActionProps {
  product: Product;
  sxLink?: SxProps<Theme>;
  sxButton?: SxProps<Theme>;
}

export default function DetailsButton({
  product,
  sxLink,
  sxButton,
}: ProductActionProps) {
  const navigate = useNavigate();
  const buttonStyle = {
    fontWeight: 'bold',
    padding: '4px',
    minHeight: '42px',
    marginBottom: '0px',
  };

  return (
    <Link
      component={NavLink}
      to={`/products/${product.id}`}
      sx={{ marginBottom: '16px', ...sxLink }}
    >
      <Button
        sx={{ ...buttonStyle, ...sxButton }}
        variant="outlined"
        fullWidth
        // href={`/products/${product.id}`}
        onClick={(_) => {
          navigate(`/products/${product.id}`);
        }}
      >
        Details
      </Button>
    </Link>
  );
}

import { Box, Button } from '@mui/material';
import AddToCartIcon from '@mui/icons-material/AddShoppingCart';
import { Product } from '@/jotai/data/product';
import { Add, Remove } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { useAddUpdateCartEffect } from '@/hooks/useAddUpdateCartEffect';

interface AddUpdateButtonProps {
  product: Product;
}

export default function AddUpdateButton({ product }: AddUpdateButtonProps) {
  const { handleCartIncrement, onDecrementClicked, quantity, loading } =
    useAddUpdateCartEffect({ product });

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '44px',
        padding: '6px 0',
      }}
    >
      <Button
        variant="text"
        fullWidth
        onClick={handleCartIncrement}
        sx={{ display: quantity < 1 ? 'flex' : 'none' }}
      >
        {quantity < 1 && loading ? (
          <CircularProgress size="22px" />
        ) : (
          <>
            <AddToCartIcon
              sx={{
                height: '32px',
                width: 'auto',
                marginRight: '4px',
              }}
            />
            <Box sx={{ fontSize: '16px' }}>Add</Box>
          </>
        )}
      </Button>
      <Button
        sx={{
          display: quantity > 0 ? 'flex' : 'none',
          minWidth: 0,
          padding: '4px',
        }}
        onClick={onDecrementClicked}
        variant="outlined"
      >
        <Remove />
      </Button>
      <Box
        sx={{
          display: quantity > 0 ? 'flex' : 'none',
          minWidth: 0,
          padding: '4px',
          lineHeight: 1,
          fontSize: '22px',
        }}
      >
        {loading ? <CircularProgress size="22px" /> : quantity}
      </Box>
      <Button
        sx={{
          display: quantity > 0 ? 'flex' : 'none',
          minWidth: 0,
          padding: '4px',
        }}
        onClick={handleCartIncrement}
        variant="outlined"
      >
        <Add />
      </Button>
    </Box>
  );
}

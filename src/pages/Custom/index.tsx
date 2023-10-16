import { Header } from '@/components';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Link,
  OutlinedInput,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ChangeEvent, useState } from 'react';
import { defaultPlaceholderImage } from '@/store/data/data';

export default function CustomPage() {
  const initialValue = {
    name: '',
    details: '',
    image: '',
  };
  const [data, setData] = useState(initialValue);

  const handleInputNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, name: e.target.value });
  };
  const handleInputDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, details: e.target.value });
  };

  return (
    <Box>
      <Header showBackIcon />
      <Box sx={{ padding: '16px' }}>
        <Box component="h3" sx={{ textAlign: 'center' }}>
          Request Custom Quote
        </Box>
        <FormControl fullWidth sx={{ marginBottom: '16px' }}>
          <FormLabel htmlFor="product-name">Item Name</FormLabel>
          <OutlinedInput
            type="text"
            id="product-name"
            fullWidth
            size="small"
            value={data.name}
            onChange={handleInputNameChange}
          />
        </FormControl>
        <FormControl fullWidth sx={{ marginBottom: '16px' }}>
          <FormLabel htmlFor="product-details">Item Details</FormLabel>
          <OutlinedInput
            type="text"
            id="product-details"
            fullWidth
            size="small"
            value={data.details}
            onChange={handleInputDetailsChange}
          />
        </FormControl>
        <Box sx={{ width: '100%' }}>
          <Box
            component="img"
            src={defaultPlaceholderImage.src}
            srcSet={defaultPlaceholderImage.srcSet}
            alt="Custom item for quote"
            sx={{ width: '100%', height: 'auto' }}
          />
        </Box>
        <Button
          component="label"
          variant="contained"
          fullWidth
          startIcon={<CloudUploadIcon />}
        >
          <input
            type="file"
            hidden
            style={{
              clip: 'rect(0 0 0 0)',
              clipPath: 'inset(50%)',
              height: '1px',
              overflow: 'hidden',
              position: 'absolute',
              bottom: '0',
              left: '0',
              whiteSpace: 'nowrap',
              width: '1px',
            }}
            accept="image/*"
          />
          Upload Image
        </Button>
        <Link
          target="_blank"
          href="https://api.whatsapp.com/send?phone=+919967717702&text=Hi"
        >
          Send Message
        </Link>
      </Box>
    </Box>
  );
}

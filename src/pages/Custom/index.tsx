import { Header } from '@/components';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WhatsApp from '@mui/icons-material/WhatsApp';
import { ChangeEvent, useState } from 'react';

export default function CustomPage() {
  const initialValue = {
    name: '',
    details: '',
    image: '',
  };
  const [data, setData] = useState(initialValue);
  const handleInputDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, details: e.target.value });
  };

  return (
    <Box>
      <Header showBackIcon />
      <Box sx={{ padding: '16px' }}>
        <Button
          startIcon={<WhatsApp />}
          variant="contained"
          sx={{
            textTransform: 'none',
            textAlign: 'center',
            margin: '8px auto',
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
          href="https://api.whatsapp.com/send?phone=+919967717702&text=Hi"
        >
          Click for Whats App Chat
        </Button>
        <Box
          sx={{ textAlign: 'center', margin: '8px auto', fontWeight: 'bold' }}
        >
          OR
        </Box>
        <Button
          sx={{
            textAlign: 'center',
            margin: '0 auto 8px auto',
            fontWeight: 'bold',
            width: '100%',
          }}
          href="#product-details"
        >
          Request Custom Quote
        </Button>
        <FormControl fullWidth sx={{ marginBottom: '16px' }}>
          <FormLabel sx={{ marginBottom: '8px' }} htmlFor="product-details">
            Requirement Details
          </FormLabel>
          <OutlinedInput
            type="text"
            id="product-details"
            fullWidth
            size="small"
            value={data.details}
            onChange={handleInputDetailsChange}
            multiline
          />
        </FormControl>

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
          Add Image
        </Button>
      </Box>
    </Box>
  );
}

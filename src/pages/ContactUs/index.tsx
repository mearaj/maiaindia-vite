import { Header } from '@/components';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WhatsApp from '@mui/icons-material/WhatsApp';
import { ChangeEvent, useState } from 'react';
import createStyles from '@/pages/ContactUs/styles';

export default function ContactUsPage() {
  const initialValue = {
    name: '',
    details: '',
    image: '',
  };
  const [data, setData] = useState(initialValue);
  const handleInputDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, details: e.target.value });
  };
  const theme = useTheme();

  const styles = createStyles(theme);

  return (
    <Box>
      <Header />
      <Box sx={{ padding: '16px' }}>
        <Button
          startIcon={<WhatsApp />}
          variant="outlined"
          sx={styles.whatsAppButton}
          href="https://api.whatsapp.com/send?phone=+919173169661&text=Hi"
        >
          Click for Whats App Chat
        </Button>
        <Box
          sx={{ textAlign: 'center', margin: '8px auto', fontWeight: 'bold' }}
        >
          OR
        </Box>
        <Button sx={styles.customQuoteButton} href="#product-details">
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
            minRows={3}
          />
        </FormControl>
        <Button
          component="label"
          variant="outlined"
          fullWidth
          startIcon={<CloudUploadIcon />}
        >
          <input
            type="file"
            hidden
            required
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

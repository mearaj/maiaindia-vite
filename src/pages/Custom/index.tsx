import { Header } from '@/components';
import { Button, FormControl, FormLabel, OutlinedInput } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ChangeEvent, useState } from 'react';
import { defaultPlaceholderImage } from '@/store/data/data';
import styles from './index.module.css';

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
    <div className={styles.page}>
      <Header className={styles.header} showBackIcon />
      <div className={styles.body}>
        <h3 style={{ textAlign: 'center' }}>Request Custom Quote</h3>
        <FormControl fullWidth className={styles.formFieldContainer}>
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
        <FormControl fullWidth className={styles.formFieldContainer}>
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
        <div className={styles.customImageContainer}>
          <img
            src={defaultPlaceholderImage.src}
            srcSet={defaultPlaceholderImage.srcSet}
            alt="Custom item for quote"
            className={styles.customImage}
          />
        </div>
        <Button
          component="label"
          variant="contained"
          fullWidth
          startIcon={<CloudUploadIcon />}
        >
          <input
            type="file"
            hidden
            className={styles.inputImageUpload}
            accept="image/*"
          />
          Upload Image
        </Button>
        <div>This is the add custom product page</div>
      </div>
    </div>
  );
}

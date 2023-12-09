import * as React from 'react';
import { SyntheticEvent, useContext } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import Button from '@mui/material/Button';
import { Cancel, Edit } from '@mui/icons-material';

import {
  ProductFormModeState,
  ProductFormUploadingState,
} from '@/recoil/data/product';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  productFormModeStateSelector,
  productFormProcessingStateSelector,
  productFormSelector,
} from '@/recoil/selectors/productForm';
import CategoriesDropdown from '@/components/Dropdowns/Categories';
import { ProductFormManagerContext } from '@/providers/productFormManager';
import createStyles from './styles';

export default function AddEditProductComponent() {
  const productForm = useRecoilValue(productFormSelector);
  const [formMode, setFormMode] = useRecoilState(productFormModeStateSelector);
  const processingState = useRecoilValue(productFormProcessingStateSelector);
  const {
    handleFormSubmit,
    handleFieldChange,
    handleCategoryChange,
    isProductFormValid,
  } = useContext(ProductFormManagerContext);
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleReset = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | SyntheticEvent<Element, Event>
  ) => {
    event.preventDefault();
    // setProductForm(parentProductForm);
  };

  const formLabelSx = styles.formLabel;
  const formControlStyle = styles.formControl;

  const disableForm =
    processingState.uploadingState !== ProductFormUploadingState.idle ||
    formMode === ProductFormModeState.read;
  let addEditCancelComponent = <Box>Add New Product</Box>;
  if (productForm.id !== null) {
    const addEditContainerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
    switch (formMode) {
      case ProductFormModeState.read:
        addEditCancelComponent = (
          <Box sx={addEditContainerStyle}>
            <Box sx={{ fontSize: '16px' }}>{productForm.id}</Box>
            <IconButton
              onClick={() => {
                setFormMode(ProductFormModeState.edit);
              }}
            >
              <Edit />
            </IconButton>
          </Box>
        );
        break;
      case ProductFormModeState.edit:
        addEditCancelComponent = (
          <Box sx={addEditContainerStyle}>
            <Box sx={{ fontSize: '16px' }}>{productForm.id}</Box>
            <IconButton
              onClick={() => {
                setFormMode(ProductFormModeState.read);
              }}
            >
              <Cancel />
            </IconButton>
          </Box>
        );
        break;
      default:
        break;
    }
  }
  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ padding: '16px' }}>
        <Box
          sx={{
            textAlign: 'center',
            margin: '0 auto 8px auto',
            fontWeight: 'bold',
            width: '100%',
            fontSize: '24px',
            lineHeight: 1,
            marginBottom: '16px',
            textTransform: 'none',
          }}
        >
          {addEditCancelComponent}
        </Box>
        <form onSubmit={handleFormSubmit}>
          <FormControl fullWidth sx={formControlStyle}>
            <FormLabel sx={formLabelSx} htmlFor="product-name">
              Name&nbsp;*
            </FormLabel>
            <OutlinedInput
              type="text"
              id="product-name"
              fullWidth
              size="small"
              value={productForm.name}
              onChange={handleFieldChange('name')}
              placeholder="Enter product name..."
              disabled={disableForm}
            />
          </FormControl>
          <FormControl fullWidth sx={formControlStyle}>
            <FormLabel sx={formLabelSx} htmlFor="product-mrp">
              Max Retail Price&nbsp;*
            </FormLabel>
            <OutlinedInput
              type="number"
              id="product-mrp"
              fullWidth
              placeholder="Enter max retail price..."
              size="small"
              value={productForm.mrp}
              onChange={handleFieldChange('mrp')}
              disabled={disableForm}
            />
          </FormControl>
          <FormControl fullWidth sx={formControlStyle}>
            <FormLabel sx={formLabelSx} htmlFor="product-sp">
              Selling Price&nbsp;*
            </FormLabel>
            <OutlinedInput
              type="number"
              id="product-sp"
              placeholder="Enter selling price..."
              fullWidth
              size="small"
              value={productForm.sp}
              onChange={handleFieldChange('sp')}
              disabled={disableForm}
            />
          </FormControl>
          <CategoriesDropdown
            selectedCategory={productForm.category}
            onCategoriesChange={handleCategoryChange}
            disableForm={disableForm}
          />
          <FormControl fullWidth sx={formControlStyle}>
            <FormLabel sx={formLabelSx} htmlFor="product-details">
              Description&nbsp;
            </FormLabel>
            <OutlinedInput
              type="text"
              id="product-details"
              fullWidth
              size="small"
              value={productForm.details}
              onChange={handleFieldChange('details')}
              placeholder="Enter product description..."
              disabled={disableForm}
              minRows={3}
              multiline
            />
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              sx={{ marginRight: '16px' }}
              variant="contained"
              onClick={handleReset}
              disabled={disableForm}
            >
              Reset
            </Button>
            <Button
              disabled={!isProductFormValid() || disableForm}
              variant="contained"
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

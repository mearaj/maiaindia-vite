import { ChangeEvent, ReactNode, useCallback } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import { Cancel, Edit } from '@mui/icons-material';

import { ProductFormModeState } from '@/jotai/data/product';
import { Category } from '@/jotai/data/category';
import { useAtom } from 'jotai';
import { productFormStateAtom } from '@/jotai/atoms/productForm';
import CategoriesDropdown from '@/components/Dropdowns/Categories';
import createStyles from './styles';

export default function AddEditProductComponent() {
  const [productState, setProductState] = useAtom(productFormStateAtom);
  const { productForm, isProcessing, mode: formMode } = productState;

  const theme = useTheme();
  const styles = createStyles(theme);
  const formLabelSx = styles.formLabel;
  const formControlStyle = styles.formControl;

  const handleProductFieldChange = useCallback(
    (property: 'name' | 'details') => (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      switch (property) {
        case 'name':
          setProductState({
            ...productState,
            productForm: {
              ...productForm,
              name: val,
            },
          });
          break;
        case 'details':
          setProductState({
            ...productState,
            productForm: {
              ...productForm,
              details: val,
            },
          });
          break;
        default:
          break;
      }
    },
    [productForm, productState, setProductState]
  );
  const handleCategoryChange = (category: Category) => {
    setProductState({
      ...productState,
      productForm: {
        ...productState.productForm,
        category,
      },
    });
  };

  const disableForm = isProcessing || formMode === ProductFormModeState.read;
  let addEditCancelComponent: ReactNode = <Box>Add New Product</Box>;
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
                setProductState({
                  ...productState,
                  mode: ProductFormModeState.edit,
                });
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
                setProductState({
                  ...productState,
                  mode: ProductFormModeState.read,
                });
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
            onChange={handleProductFieldChange('name')}
            placeholder="Enter product name..."
            disabled={disableForm}
          />
        </FormControl>
        {/* <FormControl fullWidth sx={formControlStyle}> */}
        {/*  <FormLabel sx={formLabelSx} htmlFor="product-mrp"> */}
        {/*    Max Retail Price&nbsp;* */}
        {/*  </FormLabel> */}
        {/*  <OutlinedInput */}
        {/*    type="number" */}
        {/*    id="product-mrp" */}
        {/*    fullWidth */}
        {/*    placeholder="Enter max retail price..." */}
        {/*    size="small" */}
        {/*    value={productForm.variants[0]?.mrp} */}
        {/*    onChange={handleFieldChange('mrp')} */}
        {/*    disabled={disableForm} */}
        {/*  /> */}
        {/* </FormControl> */}
        {/* <FormControl fullWidth sx={formControlStyle}> */}
        {/*  <FormLabel sx={formLabelSx} htmlFor="product-sp"> */}
        {/*    Selling Price&nbsp;* */}
        {/*  </FormLabel> */}
        {/*  <OutlinedInput */}
        {/*    type="number" */}
        {/*    id="product-sp" */}
        {/*    placeholder="Enter selling price..." */}
        {/*    fullWidth */}
        {/*    size="small" */}
        {/*    value={productForm.variants[0]?.sp} */}
        {/*    onChange={handleFieldChange('sp')} */}
        {/*    disabled={disableForm} */}
        {/*  /> */}
        {/* </FormControl> */}
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
            value={productForm.details ?? ''}
            onChange={handleProductFieldChange('details')}
            placeholder="Enter product description..."
            disabled={disableForm}
            minRows={3}
            multiline
          />
        </FormControl>
      </Box>
    </Box>
  );
}

import * as React from 'react';
import { ChangeEvent, ReactNode, SyntheticEvent, useState } from 'react';
import {
  AlertColor,
  Box,
  FormControl,
  FormLabel,
  IconButton,
  LinearProgress,
  OutlinedInput,
} from '@mui/material';
import Button from '@mui/material/Button';
import { categories, Category } from '@/recoil/data/category';
import { Cancel, Edit } from '@mui/icons-material';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from '@firebase/firestore';
import { appFirestore } from '@/firebase';

import { Product, ProductForm, ProductWithoutID } from '@/recoil/data/product';
import { useSetRecoilState } from 'recoil';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { useNavigate } from 'react-router-dom';
import SnackbarDialog from '@/components/Dialogs/SnackBar';
import { appAbsoluteRoutes } from '@/Router';
import CategoriesDropdown from '@/components/Dropdowns/Categories';

enum UploadingState {
  idle,
  updatingProduct,
  creatingProduct,
  updatingImages,
}

interface ProcessingState {
  uploadingState: UploadingState;
  uploadProgress: number;
}

enum FormModeEnum {
  new,
  read,
  edit,
}

export default function AddEditProductComponent({
  productForm: parentProductForm,
}: {
  productForm: ProductForm | null;
}) {
  const initialProductForm: ProductForm = {
    name: '',
    details: '',
    mrp: '',
    sp: '',
    category: categories[categories.length - 1],
    id: '',
  };

  // const styles = createStyles(theme);
  const [productForm, setProductForm] = useState<ProductForm>(
    parentProductForm || initialProductForm
  );
  const [formMode, setFormMode] = useState(
    parentProductForm ? FormModeEnum.read : FormModeEnum.new
  );
  const [processingState, setProcessingState] = useState<ProcessingState>({
    uploadingState: UploadingState.idle,
    uploadProgress: 0,
  });
  const setDialogComponent = useSetRecoilState(selectedDialogAtom);
  const navigate = useNavigate();

  const isValid = () => {
    return (
      productForm &&
      productForm.name &&
      productForm.mrp &&
      productForm.sp &&
      productForm.details
    );
  };
  const handleChange =
    (property: 'name' | 'details' | 'image' | 'mrp' | 'sp') =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      let numVal: number | string = parseFloat(val);
      if (Number.isNaN(numVal)) {
        numVal = '';
      }
      switch (property) {
        case 'name':
          setProductForm({ ...productForm, name: val });
          break;
        case 'details':
          setProductForm({ ...productForm, details: val });
          break;
        case 'image':
          break;
        case 'mrp':
          setProductForm({ ...productForm, mrp: numVal });
          break;
        case 'sp':
          setProductForm({ ...productForm, sp: numVal });
          break;
        default:
          break;
      }
    };
  const handleCategoryChange = (category: Category) => {
    setProductForm({ ...productForm, category });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid()) {
      return;
    }
    if (formMode === FormModeEnum.read) {
      return;
    }
    let currentProcessingState = UploadingState.creatingProduct;
    if (formMode === FormModeEnum.edit) {
      currentProcessingState = UploadingState.updatingProduct;
    }
    setProcessingState({
      ...processingState,
      uploadingState: currentProcessingState,
    });
    const newProduct: ProductWithoutID = {
      name: productForm.name,
      categoryID: productForm.category.id,
      price: {
        timestamp: serverTimestamp(),
        currency: 'INR',
        mrp: productForm.mrp as number,
        sp: productForm.sp as number,
      },
    };
    let message: string = '';
    let severity: AlertColor = 'success';
    let productID = '';
    try {
      if (productForm.id === null) {
        const res = await addDoc(
          collection(appFirestore, 'products'),
          newProduct
        );
        message = `Successfully created ${newProduct.name} with ID ${res.id}`;
        productID = res.id;
      } else {
        const updateProduct: Product = { ...newProduct, id: productForm.id };
        const productRef = doc(appFirestore, 'products', productForm.id);
        await setDoc(productRef, updateProduct);
        message = `Successfully updated ${newProduct.name} with ID ${productForm.id}`;
        productID = productForm.id;
      }
      navigate(`${appAbsoluteRoutes.adminProducts}/${productID}`);
    } catch (_) {
      if (productForm.id !== null) {
        message = `Failed to update ${productForm.name} with ID ${productForm.id}`;
      } else {
        message = 'Failed to create new Product';
      }
      severity = 'error';
    } finally {
      currentProcessingState = UploadingState.idle;
      setProcessingState({
        ...processingState,
        uploadingState: currentProcessingState,
        uploadProgress: 0,
      });
      setDialogComponent(
        <SnackbarDialog severity={severity} message={message} />
      );
    }
  };

  const handleReset = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | SyntheticEvent<Element, Event>
  ) => {
    event.preventDefault();
    setProductForm(parentProductForm || initialProductForm);
  };

  const formLabelSx = {
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: 600,
  };
  const formControlStyle = {
    marginBottom: '16px',
    width: '100%',
  };

  const getUploadProgressContainer = () => {
    let uploadProgressContainer: ReactNode;
    if (processingState.uploadingState !== UploadingState.idle) {
      let progressBar: ReactNode;
      switch (processingState.uploadingState) {
        case UploadingState.creatingProduct:
          progressBar = (
            <Box>
              <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
              <Box>Creating New Product</Box>
            </Box>
          );
          break;
        case UploadingState.updatingProduct:
          progressBar = (
            <Box>
              <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
              <Box>
                Updating Product ${productForm.name} with ID ${productForm.id}
              </Box>
            </Box>
          );
          break;
        default:
          break;
      }
      if (progressBar) {
        uploadProgressContainer = (
          <Box
            sx={{
              width: '100%',
              height: '50px',
              padding: '8px',
              backgroundColor: 'white',
              marginBottom: '16px',
            }}
          >
            {progressBar}
          </Box>
        );
      }
    }
    return uploadProgressContainer;
  };
  const disableForm =
    processingState.uploadingState !== UploadingState.idle ||
    formMode === FormModeEnum.read;
  let addEditCancelComponent = <Box>Add New Product</Box>;
  switch (formMode) {
    case FormModeEnum.read:
      addEditCancelComponent = (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ fontSize: '16px' }}>{productForm.id}</Box>
          <IconButton
            onClick={() => {
              setFormMode(FormModeEnum.edit);
            }}
          >
            <Edit />
          </IconButton>
        </Box>
      );
      break;
    case FormModeEnum.edit:
      addEditCancelComponent = (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ fontSize: '16px' }}>{productForm.id}</Box>
          <IconButton
            onClick={() => {
              setFormMode(FormModeEnum.read);
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

  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      {getUploadProgressContainer()}
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
        <form onSubmit={onSubmit}>
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
              onChange={handleChange('name')}
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
              onChange={handleChange('mrp')}
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
              onChange={handleChange('sp')}
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
              onChange={handleChange('details')}
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
              disabled={!isValid() || disableForm}
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

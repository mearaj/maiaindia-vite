import { ReactNode } from 'react';
import { Box, LinearProgress } from '@mui/material';

import { ProductFormUploadingState } from '@/recoil/data/product';
import { useRecoilValue } from 'recoil';
import {
  productFormProcessingStateSelector,
  productFormSelector,
} from '@/recoil/selectors/productForm';

export default function AdminProductProcessingStateComponent() {
  const processingState = useRecoilValue(productFormProcessingStateSelector);
  const productForm = useRecoilValue(productFormSelector);

  let uploadProgressContainer: ReactNode;
  if (processingState.uploadingState !== ProductFormUploadingState.idle) {
    let progressBar: ReactNode;
    switch (processingState.uploadingState) {
      case ProductFormUploadingState.creatingProduct:
        progressBar = (
          <Box>
            <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
            <Box>Creating New Product</Box>
          </Box>
        );
        break;
      case ProductFormUploadingState.updatingProduct:
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
}

import * as React from 'react';
import { ReactNode, useCallback, useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogProps,
  LinearProgress,
  useTheme,
} from '@mui/material';
import Button from '@mui/material/Button';

import {
  LocallyUploadedImage,
  ProductFormModeState,
  Variant,
  VariantImage,
} from '@/jotai/data/product';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Delete } from '@mui/icons-material';
import { useAtom, useSetAtom } from 'jotai/index';
import { productFormStateAtom } from '@/jotai/atoms/productForm';
import createStyles from '@/components/Admin/ProductDetails/VariantFormFooter/styles';
import SnackbarDialog from '@/components/Dialogs/SnackBar';

interface AdminVariantFormFooterProps {
  variant: Variant;
}

export default function AdminVariantFormFooter({
  variant,
}: AdminVariantFormFooterProps) {
  const [productFormState, setProductFormState] = useAtom(productFormStateAtom);
  const { isProcessing, mode: formMode, productForm } = productFormState;
  const setDialogComponent = useSetAtom(selectedDialogAtom);
  const theme = useTheme();
  const styles = createStyles(theme);
  const [localDialog, setLocalDialog] = useState<{
    props: DialogProps;
    children: ReactNode;
  } | null>(null);

  const handleRemoveVariant = useCallback(async () => {
    if (isProcessing) {
      return;
    }
    const variants =
      productForm.variants.filter(
        (eachVariant) => eachVariant.id !== variant.id
      ) ?? [];
    setProductFormState({
      ...productFormState,
      productForm: {
        ...productFormState.productForm,
        variants,
      },
    });
  }, [
    isProcessing,
    productForm.variants,
    productFormState,
    setProductFormState,
    variant.id,
  ]);

  const handleImagesUploadLocally = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const { files } = event.target;
    if (files && files.length > 0) {
      setProductFormState({ ...productFormState, isProcessing: true });
      let localDialogMessage = 'Uploading Images Locally';
      try {
        setLocalDialog({
          props: { open: true },
          children: (
            <Box>
              <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
              <Box>{localDialogMessage}</Box>
            </Box>
          ),
        });
        const errors: { name: string; message: string }[] = [];
        const supportedImages: LocallyUploadedImage[] = [];
        for await (const file of files) {
          let errorFound = false;
          if (file.type.toLowerCase() !== 'image/avif') {
            errorFound = true;
            localDialogMessage = `Unsupported file extension ${file.type}.\nSupported extension is .avif`;
          }
          if (!errorFound && file.size > 1024 * 1024) {
            errorFound = true;
            localDialogMessage = `File size ${
              file.size / 1024
            }Kb exceeds limit of 200kb`;
          }
          if (
            !errorFound &&
            variant?.images?.find(
              (eachImage: VariantImage) => eachImage.name === file.name
            )
          ) {
            errorFound = true;
            localDialogMessage = `Image ${file.name} with the same name already exists.`;
          }
          if (errorFound) {
            errors.push({
              name: file.name,
              message: localDialogMessage,
            });
            setLocalDialog({
              props: { open: true },
              children: (
                <Box>
                  <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
                  <Box>{localDialogMessage}</Box>
                </Box>
              ),
            });
            continue;
          }
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = (_ev) => {
              supportedImages.push({ file, url: img.src });
              const newLocalMessage = `Uploaded file ${file.name} locally`;
              setLocalDialog({
                props: { open: true },
                children: (
                  <Box>
                    <LinearProgress
                      sx={{ width: '100%', marginBottom: '4px' }}
                    />
                    <Box>{newLocalMessage}</Box>
                  </Box>
                ),
              });
              resolve();
            };
            img.onerror = (e) => {
              errors.push({ name: file.name, message: e.toString() });
              const newLocalMessage = `Failed to upload file ${
                file.name
              } locally.\nError: ${e.toString()}`;
              setLocalDialog({
                props: { open: true },
                children: (
                  <Box>
                    <LinearProgress
                      sx={{ width: '100%', marginBottom: '4px' }}
                    />
                    <Box>{newLocalMessage}</Box>
                  </Box>
                ),
              });
              URL.revokeObjectURL(img.src);
              resolve();
            };
          });
        }
        if (errors.length > 0) {
          setDialogComponent(
            <SnackbarDialog
              severity="error"
              message={`Failed to upload ${errors.length} file(s) locally!`}
            />
          );
        }
        if (supportedImages.length > 0) {
          setDialogComponent(
            <SnackbarDialog
              severity="success"
              message={`Successfully uploaded ${supportedImages.length} file(s) locally!`}
            />
          );
        }
        variant.localImages = [
          ...(variant?.localImages ?? []),
          ...supportedImages,
        ].filter((eachImage, index, arr) => {
          return (
            index ===
            arr.findIndex(
              (imgToFind) => eachImage.file.name === imgToFind.file.name
            )
          );
        });
        const foundIndex = productForm.variants.findIndex((eachVariant) => {
          return variant.id === eachVariant.id;
        });
        if (foundIndex >= 0) {
          productForm.variants[foundIndex] = variant;
        }
        setProductFormState({
          ...productFormState,
          isProcessing: false,
          productForm: {
            ...productForm,
          },
        });
        setLocalDialog(null);
      } catch (_e) {
        setProductFormState({ ...productFormState, isProcessing: false });
        setLocalDialog(null);
      }
    }
  };

  const disableForm = isProcessing || formMode === ProductFormModeState.read;
  const uploadImagesButton = (
    <Button
      component="label"
      sx={{ marginBottom: '16px' }}
      variant="contained"
      disabled={disableForm}
      color="warning"
      startIcon={<CloudUploadIcon />}
    >
      <Box
        component="input"
        type="file"
        hidden
        placeholder="Product Upload Images"
        sx={styles.nativeUploadInput}
        accept="image/avif"
        onChange={handleImagesUploadLocally}
        multiple
        id={`${variant.id}-images-upload`}
      />
      Upload Images
    </Button>
  );
  const deleteProductButton = (
    <Button
      sx={{ marginBottom: '16px' }}
      variant="contained"
      disabled={disableForm}
      onClick={handleRemoveVariant}
      startIcon={<Delete />}
      color="error"
    >
      Remove Variant
    </Button>
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          padding: '0 16px',
          marginBottom: '32px',
        }}
      >
        {uploadImagesButton}
        {deleteProductButton}
      </Box>
      {isProcessing && localDialog && (
        <Dialog sx={styles.dialogContainer} {...localDialog.props}>
          <DialogContent>{localDialog.children}</DialogContent>
        </Dialog>
      )}
    </>
  );
}

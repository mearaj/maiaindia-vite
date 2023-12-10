import * as React from 'react';
import { ReactNode, SyntheticEvent, useCallback, useState } from 'react';
import {
  AlertColor,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  LinearProgress,
  useTheme,
} from '@mui/material';
import Button from '@mui/material/Button';

import {
  LocallyUploadedImage,
  Product,
  ProductFormModeState,
  ProductWithoutID,
} from '@/recoil/data/product';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  productFormImagesSelector,
  productFormLocalImagesSelector,
  productFormModeStateSelector,
  productFormProcessingStateSelector,
  productFormSelector,
} from '@/recoil/selectors/productForm';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from '@firebase/firestore';
import { appFirebaseStorage, appFirestore } from '@/firebase';
import { useNavigate } from 'react-router-dom';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { categories } from '@/recoil/data/category';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { deleteObject, ref } from '@firebase/storage';
import createStyles from './styles';
import { appAbsoluteRoutes } from '@/Router';
import SnackbarDialog from '@/components/Dialogs/SnackBar';

interface AdminProductFormFooterComponentProps {
  handleReset: (
    event?:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | SyntheticEvent<Element, Event>
  ) => void;
}

export default function AdminProductFormFooterComponent({
  handleReset,
}: AdminProductFormFooterComponentProps) {
  const formMode = useRecoilValue(productFormModeStateSelector);
  const [isProcessing, setIsProcessing] = useRecoilState(
    productFormProcessingStateSelector
  );
  const productForm = useRecoilValue(productFormSelector);
  const navigate = useNavigate();
  const setDialogComponent = useSetRecoilState(selectedDialogAtom);
  const theme = useTheme();
  const styles = createStyles(theme);
  const [localImages, setLocalImages] = useRecoilState(
    productFormLocalImagesSelector
  );
  const productImages = useRecoilValue(productFormImagesSelector);
  const [localDialog, setLocalDialog] = useState<{
    props: DialogProps;
    children: ReactNode;
  } | null>(null);

  const isProductFormValid = useCallback(() => {
    return !!(
      productForm &&
      productForm.name &&
      ((typeof productForm.mrp === 'number' && productForm.mrp >= 0) ||
        (typeof productForm.mrp === 'string' &&
          !Number.isNaN(parseFloat(productForm.mrp)) &&
          parseFloat(productForm.mrp) >= 0)) &&
      ((typeof productForm.sp === 'number' && productForm.sp >= 0) ||
        (typeof productForm.sp === 'string' &&
          !Number.isNaN(
            parseFloat(productForm.sp) && parseFloat(productForm.sp) >= 0
          ))) &&
      categories.find(
        (eachCategory) => eachCategory.id === productForm.category.id
      )
    );
  }, [productForm]);

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
      event.preventDefault();
      if (!isProductFormValid()) {
        return;
      }
      if (formMode === ProductFormModeState.read) {
        return;
      }

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
      let snackbarMsg: string = '';
      let severity: AlertColor = 'success';
      let productID = '';
      let localDialogMessage = 'Creating New Product';
      try {
        if (productForm.id !== null) {
          localDialogMessage = `Updating Product ${productForm.name} with ID ${productForm.id}`;
        }
        setIsProcessing(true);
        setLocalDialog({
          props: { open: true },
          children: (
            <Box>
              <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
              <Box>{localDialogMessage}</Box>
            </Box>
          ),
        });
        if (productForm.id === null) {
          const res = await addDoc(
            collection(appFirestore, 'products'),
            newProduct
          );
          snackbarMsg = `Successfully created ${newProduct.name} with ID ${res.id}`;
          productID = res.id;
        } else {
          const updateProduct: Product = { ...newProduct, id: productForm.id };
          const productRef = doc(appFirestore, 'products', productForm.id);
          await setDoc(productRef, updateProduct);
          snackbarMsg = `Successfully updated ${newProduct.name} with ID ${productForm.id}`;
          productID = productForm.id;
        }
        navigate(`${appAbsoluteRoutes.adminProducts}/${productID}`);
      } catch (_) {
        if (productForm.id !== null) {
          snackbarMsg = `Failed to update ${productForm.name} with ID ${productForm.id}`;
        } else {
          snackbarMsg = 'Failed to create new Product';
        }
        severity = 'error';
      } finally {
        setLocalDialog(null);
        setIsProcessing(false);
        setDialogComponent(
          <SnackbarDialog severity={severity} message={snackbarMsg} />
        );
      }
    },
    [
      formMode,
      isProductFormValid,
      navigate,
      productForm.category.id,
      productForm.id,
      productForm.mrp,
      productForm.name,
      productForm.sp,
      setDialogComponent,
      setIsProcessing,
    ]
  );

  const shouldDeleteProductPrompt = useCallback(async (): Promise<boolean> => {
    return new Promise<boolean>((r) => {
      const open = true;
      setDialogComponent(
        <Dialog
          open={open}
          onClose={() => {
            r(false);
            setDialogComponent(null);
          }}
        >
          <DialogContent>
            Are you sure you want to delete product?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                r(false);
                setDialogComponent(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                r(true);
                setDialogComponent(null);
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      );
    });
  }, [setDialogComponent]);

  const handleDeleteProduct = useCallback(async () => {
    if (productForm.id !== null && !isProcessing) {
      const shouldDelete = await shouldDeleteProductPrompt();
      if (shouldDelete) {
        let localDialogMessage = `Deleting Product ${productForm.name} with ID ${productForm.id}`;
        if (productImages.length > 0) {
          localDialogMessage = `Deleting Product ${productForm.name} Images with ID ${productForm.id}`;
        }
        setIsProcessing(true);
        setLocalDialog({
          props: { open: true },
          children: (
            <Box>
              <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
              <Box>{localDialogMessage}</Box>
            </Box>
          ),
        });
        try {
          for await (const eachImage of productImages) {
            localDialogMessage = `Deleting Image ${eachImage.name}`;
            const imageFileRef = ref(
              appFirebaseStorage,
              `products/${productForm.id}/${eachImage.name}`
            );
            setLocalDialog({
              props: { open: true },
              children: (
                <Box>
                  <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
                  <Box>{localDialogMessage}</Box>
                </Box>
              ),
            });
            await deleteObject(imageFileRef);
            localDialogMessage = `Successfully deleted Image ${eachImage.name}`;
            setLocalDialog({
              props: { open: true },
              children: (
                <Box>
                  <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
                  <Box>{localDialogMessage}</Box>
                </Box>
              ),
            });
          }
          if (productImages.length > 0) {
            localDialogMessage = `Successfully deleted images for product ${productForm.name} with id ${productForm.id}`;
            setLocalDialog({
              props: { open: true },
              children: (
                <Box>
                  <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
                  <Box>{localDialogMessage}</Box>
                </Box>
              ),
            });
          }
          await deleteDoc(doc(appFirestore, 'products', productForm.id!));
          setDialogComponent(
            <SnackbarDialog
              severity="success"
              message={`successfully deleted product ${productForm.name} with id ${productForm.id}`}
            />
          );
          navigate(appAbsoluteRoutes.adminProducts);
        } catch (e) {
          setDialogComponent(
            <SnackbarDialog
              severity="error"
              message={
                e instanceof Error
                  ? e.message
                  : `Failed to deleted product ${productForm.name} with id ${productForm.id}`
              }
            />
          );
        } finally {
          setIsProcessing(false);
          setLocalDialog(null);
        }
      }
    }
  }, [
    isProcessing,
    navigate,
    productForm.id,
    productForm.name,
    productImages,
    setDialogComponent,
    setIsProcessing,
    shouldDeleteProductPrompt,
  ]);

  const handleImagesUploadLocally = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    const { files } = event.target;
    if (files && files.length > 0) {
      setIsProcessing(true);
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
          if (file.type.toLowerCase() !== 'image/avif') {
            localDialogMessage = `Unsupported file extension ${file.type}.\nSupported extension is .avif`;
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
          if (file.size > 1024 * 200) {
            localDialogMessage = `File size ${
              file.size / 1024
            }Kb exceeds limit of 200kb`;
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
          await new Promise<void>((r) => {
            setTimeout(() => {
              r();
            }, 2000);
          });
        }
        if (supportedImages.length > 0) {
          setDialogComponent(
            <SnackbarDialog
              severity="success"
              message={`Successfully uploaded ${supportedImages.length} file(s) locally!!`}
            />
          );
        }
        const imagesToUpload = [...localImages, ...supportedImages].filter(
          (eachImage, index, arr) => {
            return (
              index ===
              arr.findIndex(
                (imgToFind) => eachImage.file.name === imgToFind.file.name
              )
            );
          }
        );
        setLocalImages(imagesToUpload);
        setIsProcessing(false);
        setLocalDialog(null);
      } catch (_e) {
        setIsProcessing(false);
        setLocalDialog(null);
      }
    }
  };

  const disableForm = isProcessing || formMode === ProductFormModeState.read;
  let uploadImagesButton: ReactNode;
  let deleteProductButton: ReactNode;
  // If product is not new
  if (productForm.id !== null) {
    uploadImagesButton = (
      <Button
        component="label"
        sx={{ marginBottom: '16px' }}
        variant="contained"
        disabled={disableForm}
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
        />
        Upload Images
      </Button>
    );
    deleteProductButton = (
      <Button
        sx={{ marginBottom: '16px' }}
        variant="contained"
        disabled={disableForm}
        onClick={handleDeleteProduct}
      >
        Delete Product
      </Button>
    );
  }
  const commonButtons = (
    <>
      {uploadImagesButton}
      <Button
        sx={{ marginBottom: '16px' }}
        variant="contained"
        onClick={(e) => {
          setLocalDialog(null);
          handleReset(e);
        }}
        disabled={disableForm}
      >
        Reset
      </Button>
      {deleteProductButton}
      <Button
        sx={{ marginBottom: '16px' }}
        disabled={!isProductFormValid() || disableForm}
        variant="contained"
        type="button"
        onClick={handleFormSubmit}
      >
        Submit
      </Button>
    </>
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
        {commonButtons}
      </Box>
      {isProcessing && localDialog && (
        <Dialog {...localDialog.props}>
          <Box sx={styles.dialogContentContainer}>{localDialog.children}</Box>
        </Dialog>
      )}
    </>
  );
}

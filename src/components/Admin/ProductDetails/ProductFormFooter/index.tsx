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
  Variant,
  VariantImage,
} from '@/jotai/data/product';

import { deleteDoc, doc, setDoc } from '@firebase/firestore';
import { appFirebaseStorage, appFirestore } from '@/firebase';
import { useNavigate } from 'react-router-dom';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { categories } from '@/jotai/data/category';
import { deleteObject, ref, uploadBytesResumable } from '@firebase/storage';
import { Delete, Publish, RestartAlt } from '@mui/icons-material';
import { useAtom, useSetAtom } from 'jotai/index';
import { productFormStateAtom } from '@/jotai/atoms/productForm';
import createStyles from '@/components/Admin/ProductDetails/ProductFormFooter/styles';
import { appAbsoluteRoutes } from '@/Router';
import SnackbarDialog from '@/components/Dialogs/SnackBar';

interface AdminProductFormFooterComponentProps {
  handleReset: (
    event?:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | SyntheticEvent<Element, Event>
  ) => void;
  variant: Variant;
}

export default function AdminProductFormFooterComponent({
  handleReset,
  variant,
}: AdminProductFormFooterComponentProps) {
  const [productFormState, setProductFormState] = useAtom(productFormStateAtom);
  const { isProcessing, mode: formMode, productForm } = productFormState;
  const navigate = useNavigate();
  const setDialogComponent = useSetAtom(selectedDialogAtom);
  const theme = useTheme();
  const styles = createStyles(theme);
  const [localDialog, setLocalDialog] = useState<{
    props: DialogProps;
    children: ReactNode;
  } | null>(null);

  const commonPromptDialogHandler = useCallback(
    async (
      content: string | ReactNode,
      noButtonText: string | null = null,
      yesButtonText: string | null = null
    ): Promise<boolean> => {
      return new Promise<boolean>((r) => {
        const open = true;
        setDialogComponent(
          <Dialog
            open={open}
            sx={styles.dialogContainer}
            onClose={() => {
              r(false);
              setDialogComponent(null);
            }}
          >
            <DialogContent sx={{ overflowX: 'hidden', wordWrap: 'break-word' }}>
              {content}
            </DialogContent>
            <DialogActions>
              {noButtonText && (
                <Button
                  onClick={() => {
                    r(false);
                    setDialogComponent(null);
                  }}
                >
                  {noButtonText}
                </Button>
              )}
              {yesButtonText && (
                <Button
                  onClick={() => {
                    r(true);
                    setDialogComponent(null);
                  }}
                >
                  {yesButtonText}
                </Button>
              )}
            </DialogActions>
          </Dialog>
        );
      });
    },
    [setDialogComponent, styles.dialogContainer]
  );

  const isProductFormValid = useCallback(() => {
    return !!(
      productForm &&
      productForm.name &&
      productForm.variants &&
      productForm.variants.length &&
      productForm.variants.every((eachVariant) => {
        return (
          !Number.isNaN(parseFloat(`${eachVariant.mrp}`)) &&
          parseFloat(`${eachVariant.mrp}`) >= 0 &&
          !Number.isNaN(parseFloat(`${eachVariant.sp}`)) &&
          parseFloat(`${eachVariant.sp}`) >= 0
        );
      }) &&
      categories.find(
        (eachCategory) => eachCategory.id === productForm.category.id
      )
    );
  }, [productForm]);

  const commonImagesDeletionHandler = useCallback(
    async (imagesArr?: VariantImage[]) => {
      if (imagesArr && imagesArr.length > 0) {
        try {
          let localDialogMessage = `Deleting Product ${productForm.name} Images with ID ${productForm.id}`;
          for await (const eachImage of imagesArr) {
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
        }
      }
    },
    [productForm.id, productForm.name, setDialogComponent]
  );

  const createImageStateComponent = (
    uniqueKey: string,
    content: string,
    progress?: number,
    determinate?: 'determinate'
  ) => (
    <Box key={uniqueKey} sx={{ marginBottom: '16px' }}>
      <LinearProgress
        value={progress}
        variant={determinate}
        sx={{ width: '100%', marginBottom: '4px' }}
      />
      <Box sx={{ fontSize: '14px', lineHeight: 1, textAlign: 'center' }}>
        {content}
      </Box>
    </Box>
  );

  const commonImagesUploadHandler = useCallback(
    async (imagesArr?: LocallyUploadedImage[]) => {
      if (!(imagesArr && imagesArr.length > 0)) {
        return;
      }

      interface ImageStateData {
        image: LocallyUploadedImage;
        progress: number;
        state: string;
      }

      const metadata = {
        contentType: 'image/avif',
      };
      const imagesStateMap: {
        [imageName: string]: ImageStateData;
      } = {};
      const imagesNameArr: string[] = [];
      const promisesArr: Promise<void>[] = [];
      imagesArr.forEach((eachLocalImage) => {
        imagesStateMap[eachLocalImage.file.name] = {
          image: eachLocalImage,
          progress: 0,
          state: `Preparing for upload of ${eachLocalImage.file.name}`,
        };
        imagesNameArr.push(eachLocalImage.file.name);
      });
      setLocalDialog({
        props: { open: true },
        children: imagesNameArr.map((eachImage) => {
          return createImageStateComponent(
            eachImage,
            imagesStateMap[eachImage].state
          );
        }),
      });
      for (const eachLocalImage of imagesArr) {
        const imagePromise = new Promise<void>((resolve) => {
          // Upload file and metadata to the object 'images/mountains.jpg'
          const storageRef = ref(
            appFirebaseStorage,
            `products/${productForm.id}/variants/${variant.id}/${eachLocalImage.file.name}`
          );
          const uploadTask = uploadBytesResumable(
            storageRef,
            eachLocalImage.file,
            metadata
          );
          const imgFilename = eachLocalImage.file.name;

          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              imagesStateMap[imgFilename].progress = progress;
              let state = `Uploaded ${progress}% of ${imgFilename}`;
              switch (snapshot.state) {
                case 'paused':
                  state += `\n. Uploading is paused.`;
                  break;
                case 'running':
                default:
                  state += `\n. Uploading is running.`;
                  break;
              }
              imagesStateMap[imgFilename].state = state;
              setLocalDialog({
                props: { open: true },
                children: imagesNameArr.map((eachImage) => {
                  return createImageStateComponent(
                    eachImage,
                    imagesStateMap[eachImage].state,
                    imagesStateMap[eachImage].progress,
                    'determinate'
                  );
                }),
              });
            },
            (error) => {
              imagesStateMap[
                imgFilename
              ].state = `Uploading ${imgFilename} failed.\n${error.message}`;
              setLocalDialog({
                props: { open: true },
                children: imagesNameArr.map((eachImage) => {
                  return createImageStateComponent(
                    eachImage,
                    imagesStateMap[eachImage].state,
                    imagesStateMap[eachImage].progress,
                    'determinate'
                  );
                }),
              });
              resolve();
            },
            () => {
              imagesStateMap[imgFilename].progress = 100;
              imagesStateMap[
                imgFilename
              ].state = `Successfully uploaded ${imgFilename}`;
              setLocalDialog({
                props: { open: true },
                children: imagesNameArr.map((eachImage) => {
                  return createImageStateComponent(
                    eachImage,
                    imagesStateMap[eachImage].state,
                    imagesStateMap[eachImage].progress,
                    'determinate'
                  );
                }),
              });
              resolve();
            }
          );
        });
        promisesArr.push(imagePromise);
      }
      await Promise.all(promisesArr);
    },
    [productForm.id, variant.id]
  );

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
      event.preventDefault();
      if (!isProductFormValid()) {
        return;
      }
      if (formMode === ProductFormModeState.read) {
        return;
      }
      const localDialogMessage = `Preparing Updating Of Product ${productForm.name} with ID ${productForm.id}`;
      const modalContentPrompt = (
        <Box>
          <Box sx={{ marginBottom: '8px' }}>
            {(variant?.localImages?.length ?? 0) > 0 && (
              <Box sx={{ lineHeight: 1 }}>
                <small>Images To Add: {variant!.localImages!.length}</small>
              </Box>
            )}
            {(variant?.imagesForDeletion?.length ?? 0) > 0 && (
              <Box sx={{ lineHeight: 1 }}>
                <small>
                  Images For Deletion: {variant!.imagesForDeletion!.length}
                </small>
              </Box>
            )}
          </Box>
          <Box>
            {`Do you want to continue updating product ${productForm.name} with
                ID ${productForm.id} ?`}
          </Box>
        </Box>
      );
      let snackbarMsg: string = '';
      let severity: AlertColor = 'success';
      const shouldContinue = await commonPromptDialogHandler(
        modalContentPrompt,
        'No',
        'Yes'
      );
      if (shouldContinue) {
        try {
          // setIsProcessing(true);
          setLocalDialog({
            props: { open: true },
            children: (
              <Box>
                <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
                <Box>{localDialogMessage}</Box>
              </Box>
            ),
          });
          const postProduct: Product = {
            name: productForm.name,
            details: productForm.details,
            categoryID: productForm.category.id,
            variants:
              productForm.variants.map((eacVariant) => ({
                id: eacVariant.id,
                mrp: eacVariant.mrp,
                sp: eacVariant.sp,
                currency: eacVariant.currency,
              })) ?? [],
          };
          await commonImagesDeletionHandler(variant.imagesForDeletion);
          await commonImagesUploadHandler(variant.localImages);
          const productRef = doc(appFirestore, 'products', productForm.id!);
          await setDoc(productRef, postProduct);
          snackbarMsg = `Successfully updated ${productForm.name} with ID ${productForm.id}`;
          navigate(`${appAbsoluteRoutes.adminProducts}/${productForm.id}`);
        } catch (e) {
          severity = 'error';
        } finally {
          setLocalDialog(null);
          setProductFormState({ ...productFormState, isProcessing: false });
          setDialogComponent(
            <SnackbarDialog severity={severity} message={snackbarMsg} />
          );
        }
      }
    },
    [
      commonImagesDeletionHandler,
      commonImagesUploadHandler,
      commonPromptDialogHandler,
      formMode,
      isProductFormValid,
      navigate,
      productForm.category.id,
      productForm.details,
      productForm.id,
      productForm.name,
      productForm.variants,
      productFormState,
      setDialogComponent,
      setProductFormState,
      variant,
    ]
  );

  const handleDeleteProduct = useCallback(async () => {
    if (productForm.id !== null && !isProcessing) {
      const shouldDelete = await commonPromptDialogHandler(
        `Are you sure you want to delete product ${productForm.name} with ID ${productForm.id}?`,
        'Cancel',
        'Yes'
      );
      if (shouldDelete) {
        let localDialogMessage = `Deleting Product ${productForm.name} with ID ${productForm.id}`;
        if (variant.images && variant.images.length > 0) {
          localDialogMessage = `Deleting Product ${productForm.name} Images with ID ${productForm.id}`;
        }
        setProductFormState({ ...productFormState, isProcessing: true });
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
          await commonImagesDeletionHandler(variant.images);
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
          setProductFormState({ ...productFormState, isProcessing: false });
          setLocalDialog(null);
        }
      }
    }
  }, [
    productForm.id,
    productForm.name,
    isProcessing,
    commonPromptDialogHandler,
    variant.images,
    setProductFormState,
    productFormState,
    commonImagesDeletionHandler,
    setDialogComponent,
    navigate,
  ]);

  const disableForm = isProcessing || formMode === ProductFormModeState.read;
  const deleteProductButton = (
    <Button
      sx={{ marginBottom: '16px' }}
      variant="contained"
      disabled={disableForm}
      onClick={handleDeleteProduct}
      startIcon={<Delete />}
      color="error"
    >
      Delete Product
    </Button>
  );
  const commonButtons = (
    <>
      <Button
        sx={{ marginBottom: '16px' }}
        variant="contained"
        onClick={(e) => {
          setLocalDialog(null);
          setProductFormState({ ...productFormState, isProcessing: false });
          handleReset(e);
        }}
        disabled={disableForm}
        startIcon={<RestartAlt />}
        color="success"
      >
        Reset Form
      </Button>
      {deleteProductButton}
      <Button
        sx={{ marginBottom: '16px', backgroundColor: '#1565c0' }}
        disabled={!isProductFormValid() || disableForm}
        variant="contained"
        type="button"
        onClick={handleFormSubmit}
        startIcon={<Publish />}
      >
        Submit Form
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
        <Dialog sx={styles.dialogContainer} {...localDialog.props}>
          <DialogContent>{localDialog.children}</DialogContent>
        </Dialog>
      )}
    </>
  );
}

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
  ProductImage,
} from '@/jotai/data/product';

import {
  productFormImagesForDeletionSelector,
  productFormImagesSelector,
  productFormLocalImagesSelector,
  productFormModeStateSelector,
  productFormProcessingStateSelector,
  productFormSelector,
} from '@/jotai/selectors/productForm';
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
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { categories } from '@/jotai/data/category';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { deleteObject, ref, uploadBytesResumable } from '@firebase/storage';
import { Delete, Publish, RestartAlt } from '@mui/icons-material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/index';
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
  const formMode = useAtomValue(productFormModeStateSelector);
  const [isProcessing, setIsProcessing] = useAtom(
    productFormProcessingStateSelector
  );
  const productForm = useAtomValue(productFormSelector);
  const navigate = useNavigate();
  const setDialogComponent = useSetAtom(selectedDialogAtom);
  const theme = useTheme();
  const styles = createStyles(theme);
  const [localImages, setLocalImages] = useAtom(productFormLocalImagesSelector);
  const productImages = useAtomValue(productFormImagesSelector) ?? [];
  const imagesForDeletion = useAtomValue(productFormImagesForDeletionSelector);
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

  const commonImagesDeletionHandler = useCallback(
    async (imagesArr: ProductImage[]) => {
      if (imagesArr.length > 0) {
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
    async (imagesArr: LocallyUploadedImage[]) => {
      if (imagesArr.length > 0 && productForm.id !== null) {
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
              `products/${productForm.id}/${eachLocalImage.file.name}`
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
      }
    },
    [productForm.id]
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

      const newProduct: Product = {
        name: productForm.name,
        categoryID: productForm.category.id,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        currency: 'INR',
        mrp: productForm.mrp as number,
        sp: productForm.sp as number,
        details: productForm.details ?? '',
      };
      let modalContentPrompt:
        | string
        | ReactNode = `Do you want to continue creating new product ${productForm.name}?`;
      let snackbarMsg: string = '';
      let severity: AlertColor = 'success';
      let productID = '';
      let localDialogMessage = 'Creating New Product';
      if (productForm.id !== null) {
        localDialogMessage = `Preparing Updating Of Product ${productForm.name} with ID ${productForm.id}`;
        modalContentPrompt = (
          <Box>
            <Box sx={{ marginBottom: '8px' }}>
              {localImages.length > 0 && (
                <Box sx={{ lineHeight: 1 }}>
                  <small>Images To Add: {localImages.length}</small>
                </Box>
              )}
              {imagesForDeletion.length > 0 && (
                <Box sx={{ lineHeight: 1 }}>
                  <small>Images For Deletion: {imagesForDeletion.length}</small>
                </Box>
              )}
            </Box>
            <Box>
              {`Do you want to continue updating product ${productForm.name} with
                ID ${productForm.id} ?`}
            </Box>
          </Box>
        );
      }
      const shouldContinue = await commonPromptDialogHandler(
        modalContentPrompt,
        'No',
        'Yes'
      );
      if (shouldContinue) {
        try {
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
            const updateProduct: Product = {
              ...newProduct,
              id: productForm.id!,
            };
            await commonImagesDeletionHandler(imagesForDeletion);
            await commonImagesUploadHandler(localImages);
            const productRef = doc(appFirestore, 'products', productForm.id!);
            await setDoc(productRef, updateProduct);
            snackbarMsg = `Successfully updated ${newProduct.name} with ID ${productForm.id}`;
            productID = productForm.id!;
          }
          navigate(`${appAbsoluteRoutes.adminProducts}/${productID}`);
        } catch (e) {
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
          // valueLoadableRefresher();
        }
      }
    },
    [
      commonImagesDeletionHandler,
      commonImagesUploadHandler,
      commonPromptDialogHandler,
      formMode,
      imagesForDeletion,
      isProductFormValid,
      localImages,
      navigate,
      productForm.category.id,
      productForm.details,
      productForm.id,
      productForm.mrp,
      productForm.name,
      productForm.sp,
      setDialogComponent,
      setIsProcessing,
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
          await commonImagesDeletionHandler(productImages);
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
    productForm.id,
    productForm.name,
    isProcessing,
    commonPromptDialogHandler,
    productImages,
    setIsProcessing,
    commonImagesDeletionHandler,
    setDialogComponent,
    navigate,
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
            productImages.find((eachImage) => eachImage.name === file.name)
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
          await new Promise<void>((r) => {
            setTimeout(r, 2000);
          });
        }
        if (supportedImages.length > 0) {
          setDialogComponent(
            <SnackbarDialog
              severity="success"
              message={`Successfully uploaded ${supportedImages.length} file(s) locally!`}
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
        startIcon={<Delete />}
        color="error"
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
          setIsProcessing(false);
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

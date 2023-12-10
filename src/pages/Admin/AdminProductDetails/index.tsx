import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil';
import { productIdSelector } from '@/recoil/selectors/productId';
import { categories } from '@/recoil/data/category';
import {
  defaultProductFormState,
  productFormStateAtom,
} from '@/recoil/atoms/productForm';
import * as React from 'react';
import { SyntheticEvent, useCallback, useEffect } from 'react';
import { ProductForm } from '@/recoil/data/product';
import { imagesByProductIDSelector } from '@/recoil/selectors/products';
import {
  productFormLocalImagesSelector,
  productFormProcessingStateSelector,
  productFormSelector,
} from '@/recoil/selectors/productForm';
import styles from './index.module.css';
import { appAbsoluteRoutes } from '@/Router';
import AddEditProductComponent from '@/components/Admin/AddEditProduct';
import AddEditProductImagesComponent from '@/components/Admin/AddEditProductImages';
import RecoilLoadablePageLayout from '@/components/Layouts/RecoilLoadablePage';
import AdminProductFormFooterComponent from '@/components/Admin/ProductFormFooter';
import RecoilLoadableComponent from '@/components/Layouts/RecoilLoadableComponent';

export default function AdminProductDetailsPage() {
  const params = useParams();
  const recoilProductValueLoadable = useRecoilValueLoadable(
    productIdSelector(params.id as string)
  );
  const recoilProductImagesValueLoadable = useRecoilValueLoadable(
    imagesByProductIDSelector(params.id as string)
  );

  const setProductFormState = useSetRecoilState(productFormStateAtom);
  const productForm = useRecoilValue(productFormSelector);
  const navigate = useNavigate();
  const locallyUploadedImages = useRecoilValue(productFormLocalImagesSelector);
  const isProcessing = useRecoilValue(productFormProcessingStateSelector);

  const product =
    recoilProductValueLoadable.state === 'hasValue' &&
    recoilProductValueLoadable.contents
      ? recoilProductValueLoadable.contents
      : undefined;
  const productImages =
    recoilProductImagesValueLoadable.state === 'hasValue' &&
    recoilProductImagesValueLoadable.contents
      ? recoilProductImagesValueLoadable.contents
      : [];

  const handleReset = useCallback(
    (
      event?:
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | SyntheticEvent<Element, Event>
    ) => {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const shouldReset =
        recoilProductImagesValueLoadable.state === 'hasValue' &&
        recoilProductValueLoadable.state === 'hasValue' &&
        !isProcessing;

      if (shouldReset && product && productImages) {
        const newProductForm: ProductForm = {
          details: product.details,
          mrp: product.price.mrp,
          sp: product.price.sp,
          name: product.name,
          id: product.id,
          category:
            categories.find(
              (eachCategory) => product?.id && eachCategory.id === product.id
            ) ?? categories[categories.length - 1],
        };
        locallyUploadedImages.forEach((eachImage) =>
          URL.revokeObjectURL(eachImage.url)
        );
        setProductFormState({
          ...defaultProductFormState,
          productForm: newProductForm,
          images: productImages,
        });
      }
    },
    [
      locallyUploadedImages,
      isProcessing,
      product,
      productImages,
      recoilProductImagesValueLoadable.state,
      recoilProductValueLoadable.state,
      setProductFormState,
    ]
  );

  useEffect(() => {
    if (
      recoilProductValueLoadable.state === 'hasValue' &&
      recoilProductImagesValueLoadable.state === 'hasValue' &&
      recoilProductValueLoadable.contents.id !== null &&
      recoilProductValueLoadable.contents.id !== productForm.id
    ) {
      const newProduct = recoilProductValueLoadable.contents;
      const newProductForm: ProductForm = {
        details: newProduct.details,
        mrp: newProduct.price.mrp,
        sp: newProduct.price.sp,
        name: newProduct.name,
        id: newProduct.id,
        category:
          categories.find(
            (eachCategory) =>
              newProduct?.id && eachCategory.id === newProduct.id
          ) ?? categories[categories.length - 1],
      };
      setProductFormState({
        ...defaultProductFormState,
        productForm: newProductForm,
        images: productImages,
      });
    }
  }, [
    productForm.id,
    productImages,
    recoilProductImagesValueLoadable.state,
    recoilProductValueLoadable.contents,
    recoilProductValueLoadable.state,
    setProductFormState,
  ]);

  return (
    <RecoilLoadablePageLayout
      recoilLoadable={recoilProductValueLoadable}
      headerProps={{
        showBackIcon: true,
        onBackIconClick: () => {
          navigate(appAbsoluteRoutes.adminProducts);
        },
      }}
    >
      <Box className={styles.body}>
        {product && (
          <>
            {productForm.id !== null && <AddEditProductComponent />}
            <RecoilLoadableComponent
              loaderContainerStyle={{ width: '100%', height: '40vh' }}
              errorContainerStyle={{ width: '100%', height: '40vh' }}
              recoilLoadable={recoilProductImagesValueLoadable}
            >
              {productImages && <AddEditProductImagesComponent />}
            </RecoilLoadableComponent>
            <AdminProductFormFooterComponent handleReset={handleReset} />
          </>
        )}
      </Box>
    </RecoilLoadablePageLayout>
  );
}

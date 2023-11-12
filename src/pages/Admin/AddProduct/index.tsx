import * as React from 'react';
import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Header } from '@/components';
import {
  Alert,
  Backdrop,
  Box,
  FormControl,
  FormLabel,
  LinearProgress,
  Menu,
  MenuItem,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import { categories, Category } from '@/firebase/category';
import { CloseOutlined, KeyboardArrowDown } from '@mui/icons-material';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from '@firebase/firestore';
import { ref, uploadBytes } from '@firebase/storage';
import { appFirebaseStorage, appFirestore } from '@/firebase';
import { useNavigate } from 'react-router-dom';
import { AddProductForm } from '@/pages/Admin/AddProduct/helper';

import { ProductWithoutID } from '@/firebase/product';

export default function AdminAddProductPage() {
  const initialValue: AddProductForm = {
    name: '',
    details: '',
    mrp: '',
    sp: '',
    category: categories[categories.length - 1],
    image: undefined,
    processingState: 'none',
    processingMsg: '',
    allowDismissAction: false,
  };
  const storageTempProductIDKey = 'tempProductID';
  const navigate = useNavigate();
  const theme = useTheme();
  const [data, setData] = useState<AddProductForm>(initialValue);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const imagePreview = useRef<HTMLImageElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const isValid = () => {
    return (
      data &&
      data.name &&
      data.mrp &&
      data.sp &&
      data.details &&
      data.image &&
      data.image.url &&
      data.image.height &&
      data.image.width
    );
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && imagePreview && imagePreview.current) {
      try {
        setData({
          ...data,
          processingState: 'info',
          processingMsg: 'Uploading image locally',
          allowDismissAction: false,
        });
        const file: File | null = event.target.files[0];
        const imgURL = URL.createObjectURL(file);
        imagePreview.current.src = imgURL;
        const img = new Image();
        img.src = imgURL;
        img.onload = () => {
          let extension = '';
          const fileType = file.type;
          const subStrIndex = fileType.lastIndexOf('/');
          if (subStrIndex > 0 && fileType.length > subStrIndex + 1) {
            extension = `${fileType.substring(subStrIndex + 1)}`;
          }
          setData(() => ({
            ...data,
            image: {
              url: img.src,
              height: img.height,
              width: img.width,
              extension,
              file,
            },
            uploadingToApp: false,
          }));
        };
        img.onerror = () => {
          setData({
            ...data,
            image: undefined,
            processingState: 'error',
            processingMsg: 'Error uploading image locally',
            allowDismissAction: true,
          });
        };
      } catch (e) {
        setData({
          ...data,
          image: undefined,
          processingState: 'error',
          processingMsg: 'Error uploading image locally',
          allowDismissAction: true,
        });
      }
    }
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
          setData({ ...data, name: val });
          break;
        case 'details':
          setData({ ...data, details: val });
          break;
        case 'image':
          break;
        case 'mrp':
          setData({ ...data, mrp: numVal });
          break;
        case 'sp':
          setData({ ...data, sp: numVal });
          break;
        default:
          break;
      }
    };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCategoryChange = (category: Category) => {
    setAnchorEl(null);
    setData({ ...data, category });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid()) {
      return;
    }
    setData({
      ...data,
      processingState: 'info',
      processingMsg: 'Uploading product details',
    });

    const uploadData: ProductWithoutID = {
      name: data.name,
      images: [
        {
          name: `${data.image!.width}x${data.image!.height}.${
            data.image!.extension
          }`,
          height: data.image!.height,
          width: data.image!.width,
        },
      ],
      categoryID: data.category.id,
      price: {
        timestamp: serverTimestamp(),
        currency: 'INR',
        mrp: data.mrp as number,
        sp: data.sp as number,
      },
    };
    const res = await addDoc(collection(appFirestore, 'products'), uploadData);
    if (res.id) {
      // Save to storage in case connection is disrupted
      localStorage.setItem(storageTempProductIDKey, res.id);
      setData({
        ...data,
        processingState: 'info',
        processingMsg: `Uploading product image`,
        allowDismissAction: false,
      });
      const imageRef = ref(
        appFirebaseStorage,
        `images/${res.id}/${uploadData.images![0].name}`
      );
      if (data.image && data.image.file != null) {
        uploadBytes(imageRef, data.image!.file).then((_: any) => {
          localStorage.removeItem(storageTempProductIDKey);
          setData({
            ...data,
            processingState: 'success',
            processingMsg: `Successfully uploaded product.`,
            allowDismissAction: false,
          });
          setTimeout(() => {
            navigate(`/products/${res.id}`);
          }, 100);
        });
      } else {
        setData({
          ...data,
          processingState: 'error',
          processingMsg: `Unable to upload product`,
          allowDismissAction: true,
        });
      }
    } else {
      setData({
        ...data,
        processingState: 'error',
        processingMsg: `Unable to upload product`,
        allowDismissAction: true,
      });
    }
  };

  const handleReset = (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | SyntheticEvent<Element, Event>
  ) => {
    event.preventDefault();
    setData(initialValue);
  };

  // if productID exists in localStorage, it implies that the document wasn't uploaded
  // fully, mostly likely images weren't uploaded, hence we delete the partial
  // uploaded documents
  useEffect(() => {
    const productID = localStorage.getItem(storageTempProductIDKey);
    if (productID) {
      deleteDoc(doc(appFirestore, 'products', productID))
        .then(() => {
          // delete images here

          //
          localStorage.removeItem(storageTempProductIDKey);
        })
        .catch(console.log);
    }
  }, []);

  const formLabelSx = {
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: 600,
  };
  const formControlStyle = {
    marginBottom: '16px',
  };

  const disableForm = data.processingState !== 'none';

  return (
    <>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Header showBackIcon />
        <Box sx={{ padding: '16px' }}>
          <Button
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
            disabled={disableForm}
            href="#product-name"
          >
            Add New Product
          </Button>
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
                value={data.name}
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
                value={data.mrp}
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
                value={data.sp}
                onChange={handleChange('sp')}
                disabled={disableForm}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: '24px', width: '100%' }}>
              <FormLabel
                sx={{
                  marginBottom: '2px',
                  fontSize: '14px',
                  fontWeight: anchorEl ? 'medium' : 'normal',
                  color: anchorEl ? 'inherit' : undefined,
                }}
                htmlFor="categories-button"
              >
                Select Category&nbsp;*
              </FormLabel>
              <Button
                sx={{ textTransform: 'none', justifyContent: 'space-between' }}
                id="categories-button"
                variant="outlined"
                onClick={handleClick}
                endIcon={<KeyboardArrowDown />}
                fullWidth
                disabled={disableForm}
              >
                {data.category.name}
              </Button>
              <Menu
                id="categories-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ '& .MuiPaper-root': { width: '100%' } }}
                MenuListProps={{
                  'aria-labelledby': 'categories-menu',
                }}
              >
                {categories
                  .filter(
                    (eachCategory) => eachCategory.id !== data.category.id
                  )
                  .map((eachCategory) => {
                    return (
                      <MenuItem
                        key={eachCategory.id}
                        sx={{ minHeight: '0px' }}
                        disabled={disableForm}
                        onClick={() => handleCategoryChange(eachCategory)}
                      >
                        {eachCategory.name}
                      </MenuItem>
                    );
                  })}
              </Menu>
            </FormControl>
            <FormControl fullWidth sx={formControlStyle}>
              <FormLabel sx={formLabelSx} htmlFor="product-details">
                Description&nbsp;*
              </FormLabel>
              <OutlinedInput
                type="text"
                id="product-details"
                fullWidth
                size="small"
                value={data.details}
                onChange={handleChange('details')}
                placeholder="Enter product description..."
                disabled={disableForm}
                minRows={3}
                multiline
              />
            </FormControl>
            <FormControl fullWidth sx={formControlStyle}>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                disabled={disableForm}
                startIcon={<CloudUploadIcon />}
              >
                <input
                  type="file"
                  hidden
                  placeholder="Product Image"
                  onChange={handleImageUpload}
                  style={{
                    clip: 'rect(0 0 0 0)',
                    clipPath: 'inset(50%)',
                    height: '1px',
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    whiteSpace: 'nowrap',
                    width: '1px',
                  }}
                  accept="image/*"
                  disabled={disableForm}
                />
                Upload Image
              </Button>
            </FormControl>
            <FormControl sx={{ ...formControlStyle, position: 'relative' }}>
              <Box
                component="img"
                ref={imagePreview}
                src="#"
                alt="Product"
                sx={{
                  height: 'auto',
                  width: '100%',
                  objectFit: 'fill',
                  objectPosition: 'center',
                  display: data.image ? 'block' : 'none',
                }}
                onLoad={(e) => {
                  e.currentTarget.scrollIntoView(true);
                }}
                onError={() => {
                  if (data.processingState !== 'none') {
                    setData({
                      ...data,
                      image: undefined,
                      processingState: 'error',
                      processingMsg: 'Error uploading image locally',
                      allowDismissAction: true,
                    });
                  }
                }}
              />
              <Button
                variant="contained"
                disabled={disableForm}
                sx={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  padding: '0px',
                  minWidth: '0px',
                  borderRadius: '50%',
                  display: data.image ? 'flex' : 'none',
                }}
                onClick={() => setData({ ...data, image: undefined })}
              >
                <CloseOutlined style={{ fontSize: '28px' }} />
              </Button>
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
      <Backdrop
        open={disableForm}
        sx={{
          zIndex: theme.zIndex.appBar + 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '0 16px',
        }}
      >
        <LinearProgress sx={{ width: '100%' }} />
        {/* <Box */}
        {/*  sx={{ */}
        {/*    padding: '16px', */}
        {/*    backgroundColor: theme.palette.primary.contrastText, */}
        {/*  }} */}
        {/* > */}
        {/* <Box */}
        {/*  sx={{ */}
        {/*    display: 'inline', */}
        {/*    clipPath: 'inset(0 0 0 0)', */}
        {/*    animation: 'ellipsisAnim 1s steps(4, end) infinite', */}
        {/*    '@keyframes ellipsisAnim': { */}
        {/*      to: { */}
        {/*        clipPath: 'inset(0px 3ch 0px 0px)', */}
        {/*      }, */}
        {/*    }, */}
        {/*  }} */}
        {/* > */}
        {/*  ... */}
        {/* </Box> */}
        {/* </Box> */}
        {data.processingState !== 'none' && (
          <Alert
            onClose={data.allowDismissAction ? handleReset : undefined}
            severity={data.processingState}
          >
            {data.processingMsg}
          </Alert>
        )}
        <LinearProgress />
      </Backdrop>
    </>
  );
}

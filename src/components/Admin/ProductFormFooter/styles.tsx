import { SxProps, Theme } from '@mui/material';

const nativeUploadInputStyles = (_: Theme): SxProps<Theme> => {
  return {
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    bottom: '0',
    left: '0',
    whiteSpace: 'nowrap',
    width: '1px',
  };
};

const formLabelStyles = (_: Theme): SxProps<Theme> => {
  return {
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: 600,
  };
};
const formControlStyles = (_: Theme): SxProps<Theme> => {
  return {
    marginBottom: '16px',
    width: '100%',
  };
};

const dialogContentContainerStyles = (_: Theme): SxProps<Theme> => {
  return {
    width: '100%',
    minHeight: '50px',
    height: 'auto',
    padding: '8px',
    backgroundColor: 'white',
    marginBottom: '16px',
  };
};

export default function createStyles(theme: Theme) {
  const nativeUploadInput = nativeUploadInputStyles(theme);
  const formLabel = formLabelStyles(theme);
  const formControl = formControlStyles(theme);
  const dialogContentContainer = dialogContentContainerStyles(theme);
  return {
    nativeUploadInput,
    formLabel,
    formControl,
    dialogContentContainer,
  };
}

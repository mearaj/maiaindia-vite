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

export default function createStyles(theme: Theme) {
  const nativeUploadInput = nativeUploadInputStyles(theme);
  const formLabel = formLabelStyles(theme);
  const formControl = formControlStyles(theme);
  return {
    nativeUploadInput,
    formLabel,
    formControl,
  };
}

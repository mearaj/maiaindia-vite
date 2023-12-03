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

export default function createStyles(theme: Theme) {
  const nativeUploadInput = nativeUploadInputStyles(theme);
  return {
    nativeUploadInput,
  };
}

import { SxProps, Theme } from '@mui/material';

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
  const formLabel = formLabelStyles(theme);
  const formControl = formControlStyles(theme);
  return {
    formLabel,
    formControl,
  };
}

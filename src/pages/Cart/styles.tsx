import { SxProps, Theme } from '@mui/material';

const rootStyles = (_: Theme): SxProps => {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
  };
};
const cartItemsBodyStyles = (_: Theme): SxProps => {
  return {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    flexGrow: 1,
    padding: '16px',
  };
};
export default function createStyles(theme: Theme) {
  const root = rootStyles(theme);
  const cartBody = cartItemsBodyStyles(theme);
  return {
    root,
    cartBody,
  };
}

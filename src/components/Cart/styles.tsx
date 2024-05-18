import { SxProps, Theme } from '@mui/material';

const rootStyles = (theme: Theme): SxProps => {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    // background: `linear-gradient(90deg, ${theme.palette.primary.dark},${theme.palette.primary.light})`,
    background: theme.palette.secondary.main,
  };
};
const cartItemsBodyStyles = (_theme: Theme): SxProps => {
  return {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    flexGrow: 1,
    padding: '16px',
    // background: `linear-gradient(90deg, ${theme.palette.primary.dark},${theme.palette.primary.light})`,
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

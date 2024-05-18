import { Theme } from '@mui/material';

const rootStyle = (theme: Theme) => ({
  position: 'fixed',
  top: '0px',
  bottom: '0px',
  right: '-100vw',
  width: '100vw',
  boxSizing: 'border-box',
  zIndex: theme.zIndex.drawer,
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

const mainStyle = (theme: Theme) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  flexGrow: '1',
  flexShrink: '1',
  overflowY: 'auto',
  overflowX: 'hidden',
  width: '85%',
  marginLeft: 'auto',
  backgroundColor: theme.palette.secondary.main,
});

export default function createStyles(theme: Theme) {
  const root = rootStyle(theme);
  const main = mainStyle(theme);

  return {
    root,
    main,
  };
}

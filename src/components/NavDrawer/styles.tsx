import { Theme } from '@mui/material';

const rootStyles = (theme: Theme) => ({
  position: 'fixed',
  top: '0px',
  bottom: '0px',
  right: '-100vw',
  width: '100vw',
  boxSizing: 'border-box',
  zIndex: theme.zIndex.drawer,
  backgroundColor: 'white',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[10],
});

const mainStyles = (_: Theme) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  flexGrow: '1',
  flexShrink: '1',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '16px',
});

export default function createStyles(theme: Theme) {
  const root = rootStyles(theme);
  const main = mainStyles(theme);

  return {
    root,
    main,
  };
}

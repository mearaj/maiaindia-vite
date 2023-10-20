import { Theme } from '@mui/material';

const rootStyles = (theme: Theme) => ({
  position: 'fixed',
  top: '0px',
  bottom: '0px',
  right: '-100vw',
  width: '100vw',
  boxSizing: 'border-box',
  zIndex: theme.zIndex.drawer,
  backgroundColor: theme.palette.primary.contrastText,
  overflowY: 'auto',
  overflowX: 'hidden',
});

const headerStyles = (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: theme.dimensions.appBarHeight,
  padding: '16px',
  width: '100%',
});

const mainStyles = (_: Theme) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  flexGrow: '1',
  flexShrink: '0',
  padding: '16px',
});

export default function createStyles(theme: Theme) {
  const root = rootStyles(theme);
  const header = headerStyles(theme);
  const main = mainStyles(theme);

  return {
    root,
    header,
    main,
  };
}

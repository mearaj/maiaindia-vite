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
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[10],
});

const headerStyles = (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: theme.dimensions.appBarHeight,
  backgroundColor: theme.palette.primary.light,
  padding: '16px',
  width: '100%',
  boxShadow: theme.shadows[2],
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
  const header = headerStyles(theme);
  const main = mainStyles(theme);

  return {
    root,
    header,
    main,
  };
}

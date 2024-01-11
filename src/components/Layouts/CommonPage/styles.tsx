import { SxProps, Theme } from '@mui/material';

const rootStyles = (_: Theme): SxProps<Theme> => {
  return {
    height: '100%',
    width: '100%',
    overflowY: 'auto',
  };
};

const bodyStyles = (theme: Theme, showHeader: boolean): SxProps<Theme> => {
  return {
    height: showHeader
      ? `calc(100% - ${theme.dimensions.appBarHeight}px)`
      : '100%',
    overflowY: 'auto',
  };
};

export default function createStyles(theme: Theme, showHeader: boolean) {
  const root = rootStyles(theme);
  const body = bodyStyles(theme, showHeader);
  return {
    root,
    body,
  };
}

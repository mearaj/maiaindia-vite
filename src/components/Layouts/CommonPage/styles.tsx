import { SxProps, Theme } from '@mui/material';

const rootStyles = (_: Theme): SxProps<Theme> => {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  };
};

const bodyStyles = (_: Theme): SxProps<Theme> => {
  return {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    flexGrow: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  };
};

export default function createStyles(theme: Theme) {
  const root = rootStyles(theme);
  const body = bodyStyles(theme);
  return {
    root,
    body,
  };
}

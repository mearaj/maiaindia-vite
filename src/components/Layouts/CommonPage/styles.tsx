import { SxProps, Theme } from '@mui/material';

const rootStyles = (_: Theme): SxProps<Theme> => {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
  };
};

const bodyStyles = (_: Theme): SxProps<Theme> => {
  return {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

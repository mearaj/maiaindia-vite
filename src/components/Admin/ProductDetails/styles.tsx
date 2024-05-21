import { alpha, SxProps, Theme } from '@mui/material';

const bodyStyle = (_: Theme): SxProps<Theme> => {
  return {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 0,
    position: 'relative',
  };
};

const bodyAltStyle = (_: Theme): SxProps<Theme> => {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  };
};

const addVariantBtnStyle = (theme: Theme): SxProps<Theme> => {
  return {
    padding: '12px',
    display: 'inline-flex',
    position: 'fixed',
    height: `${theme.dimensions.chatButtonHeight}px`,
    width: `${theme.dimensions.chatButtonHeight}px`,
    zIndex: theme.zIndex.fab,
    bottom: '16px',
    left: '16px',
    backgroundColor: alpha(theme.palette.primary.main, 0.85),
    '&:active,&:hover,&:focus': {
      backgroundColor: alpha(theme.palette.primary.main, 0.85),
    },
  };
};

export default function createStyles(theme: Theme) {
  const body = bodyStyle(theme);
  const bodyAlt = bodyAltStyle(theme);
  const addVariantBtn = addVariantBtnStyle(theme);

  return {
    body,
    bodyAlt,
    addVariantBtn,
  };
}

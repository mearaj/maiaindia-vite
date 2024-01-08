import { Theme } from '@mui/material';

const headerStyles = (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: theme.dimensions.appBarHeight,
  backgroundColor: theme.palette.primary.main,
  padding: '8px',
  width: '100%',
  boxShadow: theme.shadows[2],
});

const backIconButtonStyle = (_: Theme) => ({
  height: '100%',
  width: 'auto',
  flexShrink: 0,
  display: 'flex',
});

const iconStyle = (theme: Theme) => ({
  height: '100%',
  maxHeight: 'none',
  color: theme.palette.secondary.main,
  fontSize: '32px',
  flexShrink: 0,
});

export default function createStyles(theme: Theme) {
  const header = headerStyles(theme);
  const backIconButton = backIconButtonStyle(theme);
  const icon = iconStyle(theme);

  return {
    header,
    backIconButton,
    icon,
  };
}

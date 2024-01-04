import { Theme } from '@mui/material';

const headerStyles = (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: theme.dimensions.appBarHeight,
  backgroundColor: theme.palette.primary.main,
  padding: '16px 0px 16px 8px',
  width: '100%',
  boxShadow: theme.shadows[2],
});
export default function createStyles(theme: Theme) {
  const header = headerStyles(theme);

  return {
    header,
  };
}

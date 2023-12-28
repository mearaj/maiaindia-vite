import { Theme } from '@mui/material';

const footerStyle = (theme: Theme) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.primary.main,
  padding: '16px',
  color: theme.palette.secondary.main,
});

const containerStyle = (_: Theme) => ({ marginBottom: '16px' });
const contentTitleStyle = (_: Theme) => ({});
const contentStyle = (_: Theme) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min-content,170px))',
  gridColumnGap: '16px',
});

const radioGroupStyle = (_: Theme) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min-content,170px))',
  gridColumnGap: '16px',
});

export default function createStyles(theme: Theme) {
  const footer = footerStyle(theme);
  const container = containerStyle(theme);
  const contentTitle = contentTitleStyle(theme);
  const content = contentStyle(theme);
  const radioGroup = radioGroupStyle(theme);

  return {
    footer,
    container,
    contentTitle,
    content,
    radioGroup,
  };
}

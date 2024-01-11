import { Theme } from '@mui/material';

const footerStyle = (theme: Theme) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.primary.main,
  padding: '16px 8px 4px 16px',
  color: theme.palette.secondary.main,
});

const containerStyle = (_: Theme) => ({ marginBottom: '16px' });
const contentTitleStyle = (_: Theme) => ({
  marginBottom: '2px',
});
const contentStyle = (_: Theme) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min-content,200px))',
  gridColumnGap: '16px',
});

const iconsContainerStyle = (_: Theme) => ({
  display: 'flex',
  alignItems: 'center',
});

const iconContainerStyle = (_: Theme) => ({
  backgroundColor: 'transparent',
  borderRadius: '8px',
  display: 'inline-flex',
  marginRight: '16px',
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
  const iconsContainer = iconsContainerStyle(theme);
  const iconContainer = iconContainerStyle(theme);
  const radioGroup = radioGroupStyle(theme);

  return {
    footer,
    container,
    contentTitle,
    content,
    iconsContainer,
    iconContainer,
    radioGroup,
  };
}

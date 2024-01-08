import { SxProps, Theme } from '@mui/material';

const whatsAppButtonStyles = (_: Theme): SxProps<Theme> => {
  return {
    textTransform: 'none',
    textAlign: 'center',
    margin: '8px auto',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  };
};

const customQuoteButtonStyles = (_: Theme): SxProps<Theme> => {
  return {
    textAlign: 'center',
    margin: '0 auto 8px auto',
    fontWeight: 'bold',
    width: '100%',
  };
};

export default function createStyles(theme: Theme) {
  const whatsAppButton = whatsAppButtonStyles(theme);
  const customQuoteButton = customQuoteButtonStyles(theme);
  return {
    whatsAppButton,
    customQuoteButton,
  };
}

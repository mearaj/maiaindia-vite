import { SxProps, Theme } from '@mui/material';

const buttonStyles = (_theme: Theme): SxProps<Theme> => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 16px 8px 8px',
    width: 'calc(320px - 48px)',
    margin: '8px 8px 0 0',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '18px',
  };
};

const iconContainerStyles = (_theme: Theme): SxProps<Theme> => {
  return {
    width: '32px',
    height: '32px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
  };
};
export default function createStyles(theme: Theme) {
  const button = buttonStyles(theme);
  const iconContainer = iconContainerStyles(theme);
  return {
    button,
    iconContainer,
  };
}

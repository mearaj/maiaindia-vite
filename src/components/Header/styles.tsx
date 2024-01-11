import { Theme } from '@mui/material';

const toolbarStyles = (_: Theme) => ({
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const sectionLeftStyles = (_: Theme) => ({
  height: '100%',
  minWidth: '100px',
  flexGrow: 0,
  display: 'flex',
  alignItems: 'center',
  transition: 'flex-grow 250ms, flex-shrink 250ms',
  overflow: 'hidden',
  flexShrink: '0',
});

const sectionRightStyles = (th: Theme) => ({
  ...sectionLeftStyles(th),
  justifyContent: 'flex-end',
});

const iconStyles = (theme: Theme) => ({
  height: '100%',
  width: 'auto',
  maxHeight: 'none',
  color: theme.palette.secondary.main,
});

const logoIconButtonStyles = (_: Theme) => ({
  height: '100%',
  minWidth: '0px',
  padding: '6px 0px',
});

const backIconButtonStyles = (_: Theme) => ({
  height: '100%',
  minWidth: '0px',
  padding: '6px 0px',
});
const iconButtonStyles = (_: Theme) => ({
  height: '100%',
  padding: '12px 4px',
  minWidth: '0px',
});
const linkStyles = (_: Theme) => ({
  height: '100%',
});

export default function createStyles(theme: Theme) {
  const toolbar = toolbarStyles(theme);
  const sectionLeft = sectionLeftStyles(theme);
  const sectionRight = sectionRightStyles(theme);
  const logoIconButton = logoIconButtonStyles(theme);
  const backIconButton = backIconButtonStyles(theme);
  const iconButton = iconButtonStyles(theme);
  const icon = iconStyles(theme);
  const link = linkStyles(theme);

  return {
    toolbar,
    sectionLeft,
    sectionRight,
    logoIconButton,
    backIconButton,
    iconButton,
    icon,
    link,
  };
}

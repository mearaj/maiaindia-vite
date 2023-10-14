import { Theme } from '@mui/material';

const toolbarStyles = (_: Theme) => ({
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '4px',
  paddingBottom: '4px',
});

const sectionLeftStyles = (_: Theme) => ({
  height: '100%',
  width: 'auto',
  display: 'flex',
  alignItems: 'center',
  transition: 'flex-grow 250ms, flex-shrink 250ms',
  overflow: 'hidden',
  flexShrink: '0',
  flexGrow: '1',
});

const sectionRightStyles = (th: Theme) => ({
  ...sectionLeftStyles(th),
  justifyContent: 'flex-end',
});

const iconStyles = (_: Theme) => ({
  height: '100%',
  width: 'auto',
  maxHeight: 'none',
  maxWidth: '72px',
});

export default function styles(theme: Theme) {
  const toolbar = toolbarStyles(theme);
  const sectionLeft = sectionLeftStyles(theme);
  const sectionRight = sectionRightStyles(theme);
  const icon = iconStyles(theme);

  return {
    toolbar,
    sectionLeft,
    sectionRight,
    icon,
  };
}

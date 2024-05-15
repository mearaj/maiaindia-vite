import { Theme } from '@mui/material';

const toolbarStyles = (_: Theme) => ({
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const sectionLeftStyles = (_: Theme) => ({
  height: '100%',
  minWidth: '85px',
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
  animation: 'spin 350ms',
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

const mainStyles = (theme: Theme) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  position: 'fixed',
  top: `${theme.dimensions.appBarHeight}px`,
  height: '0px',
  zIndex: theme.zIndex.appBar,
  width: '100%',
  overflow: 'hidden',
  background: `linear-gradient(90deg, ${theme.palette.primary.dark},${theme.palette.primary.light})`,
  transition: 'height 350ms',
});

const menuVisibleStyle = (theme: Theme) => ({
  height: `calc(100vh - ${theme.dimensions.appBarHeight}px)`,
  transition: 'height 350ms',
});

const menuWrapperStyle = (_: Theme) => ({
  padding: '16px',
  overflowY: 'auto',
});

const animationStyle = (_: Theme) => ({
  '@keyframes spin': {
    '0%': {
      transform: 'scale(0,0)',
    },
    '100%': {
      transform: 'scale(1,1)',
    },
  },
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
  const main = mainStyles(theme);
  const menuVisible = menuVisibleStyle(theme);
  const menuWrapper = menuWrapperStyle(theme);
  const animation = animationStyle(theme);

  return {
    toolbar,
    sectionLeft,
    sectionRight,
    logoIconButton,
    backIconButton,
    iconButton,
    icon,
    link,
    main,
    menuVisible,
    menuWrapper,
    animation,
  };
}

import * as React from 'react';
import Menu from '@mui/icons-material/Menu';
import Diamond from '@mui/icons-material/Diamond';
import {
  AppBar,
  Box,
  Button,
  Link,
  SxProps,
  Theme,
  Toolbar,
  useTheme,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBackIos';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { useAppDispatch } from '@/store';
import { NavLink, useNavigate } from 'react-router-dom';
import { setShowMenu } from '@/store/features/ui';
import logoDarkGreen from '@/assets/images/logo-dark-green.png';
import logoCircleDarkGreen from '@/assets/images/logo-circle-dark-green.png';
import useDimensions from '@/hooks/dimensions';
import createStyles from './styles';

export interface HeaderProps {
  showBackIcon?: boolean;
  onBackIconClick?: () => void;
  sx?: SxProps<Theme>;
}

export default function Header({
  showBackIcon = false,
  onBackIconClick,
  sx,
}: HeaderProps) {
  const dimensions = useDimensions();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = createStyles(theme);
  const handleBackIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onBackIconClick) {
      onBackIconClick();
    } else if (
      window.history.length > 1
      // window.history.state &&
      // (window.history.state.idx > 0 || window.history.state.index > 0)
    ) {
      navigate('/home', { replace: true });
    } else {
      navigate('/home', { replace: true });
    }
  };

  const handleInteractionItemClick = () => {
    dispatch(setShowMenu(true));
  };

  let logoImgSrc = logoCircleDarkGreen;
  if (dimensions.width >= 360) {
    logoImgSrc = logoDarkGreen;
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        display: 'flex',
        height: `${theme.dimensions.appBarHeight}px`,
        width: '100%',
        backgroundColor: 'white',
        ...sx,
      }}
    >
      <Toolbar sx={styles.toolbar}>
        <Box sx={styles.sectionLeft}>
          {showBackIcon && (
            <Button sx={styles.logoIconButton} onClick={handleBackIconClick}>
              <ArrowBack style={styles.icon} />
            </Button>
          )}
          {!showBackIcon && (
            <Link
              variant="button"
              component={NavLink}
              to="/home"
              sx={styles.link}
            >
              <Button sx={styles.logoIconButton}>
                <Box
                  src={logoImgSrc}
                  component="img"
                  sx={styles.icon}
                  alt="Logo"
                />
              </Button>
            </Link>
          )}
        </Box>
        <Box sx={styles.sectionRight}>
          <Link
            sx={styles.link}
            variant="button"
            component={NavLink}
            to="/custom"
          >
            <Button sx={styles.iconButton}>
              <Diamond sx={styles.icon} />
            </Button>
          </Link>
          <Link sx={styles.link} component={NavLink} to="/cart">
            <Button sx={styles.iconButton}>
              <ShoppingCart sx={styles.icon} />
            </Button>
          </Link>
          <Button
            sx={styles.iconButton}
            onClick={() => handleInteractionItemClick()}
          >
            <Menu sx={styles.icon} />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

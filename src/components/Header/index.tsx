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
import { NavLink, useNavigate } from 'react-router-dom';
import logoDarkGreen from '@/assets/images/logo-yellow.png';
import logoCircleDarkGreen from '@/assets/images/logo-circle-yellow.png';
import { useRecoilState, useRecoilValue } from 'recoil';
import { menuAtom } from '@/recoil/atoms/menu';
import { userAtom } from '@/recoil/atoms';
import useDimensions from '@/hooks/useDimensions';
import createStyles from './styles';

import { appAbsoluteRoutes } from '@/Router';

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
  const [, setShowMenu] = useRecoilState(menuAtom);
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = createStyles(theme);
  const user = useRecoilValue(userAtom);
  const handleBackIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onBackIconClick) {
      onBackIconClick();
    } else if (
      window.history.length > 1
      // window.history.state &&
      // (window.history.state.idx > 0 || window.history.state.index > 0)
    ) {
      navigate(appAbsoluteRoutes.products, { replace: true });
    } else {
      navigate(appAbsoluteRoutes.products, { replace: true });
    }
  };

  const handleInteractionItemClick = () => {
    setShowMenu(true);
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
        ...sx,
      }}
    >
      <Toolbar sx={styles.toolbar}>
        <Box sx={styles.sectionLeft}>
          {showBackIcon && (
            <Button sx={styles.backIconButton} onClick={handleBackIconClick}>
              <ArrowBack style={styles.icon} />
            </Button>
          )}
          {!showBackIcon && (
            <Link
              variant="button"
              component={NavLink}
              to={appAbsoluteRoutes.products}
              sx={styles.link}
            >
              <Button sx={styles.logoIconButton}>
                <Box
                  src={logoImgSrc}
                  component="img"
                  sx={{ ...styles.icon, height: '42px' }}
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
            to={appAbsoluteRoutes.contactUs}
          >
            <Button sx={styles.iconButton}>
              <Diamond sx={styles.icon} />
            </Button>
          </Link>
          <Link
            sx={{ ...styles.link, position: 'relative' }}
            component={NavLink}
            to="/cart"
          >
            <Button sx={styles.iconButton}>
              <ShoppingCart sx={styles.icon} />
            </Button>
            {user &&
              user.userState &&
              user.userState.cart.items &&
              Object.keys(user.userState.cart.items).length > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-1px',
                    right: '-1px',
                    fontWeight: 'bold',
                    zIndex: 1,
                    color: theme.palette.secondary.main,
                  }}
                >
                  <small>
                    {Object.keys(user.userState.cart.items).reduce(
                      (prev, curr) => {
                        return (
                          prev +
                          (user.userState!.cart.items[curr].quantity ?? 0)
                        );
                      },
                      0
                    )}
                  </small>
                </Box>
              )}
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

import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Link,
  SxProps,
  Theme,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBackIos';
import { NavLink, useNavigate } from 'react-router-dom';
import { menuAtom } from '@/jotai/atoms/menu';
import { userAtom } from '@/jotai/atoms';
import { LocalMallTwoTone, WidgetsTwoTone } from '@mui/icons-material';
import { useAtom, useAtomValue } from 'jotai';
import { cartAtom } from '@/jotai/atoms/cart';
import Close from '@mui/icons-material/Close';
import LogoButton from '@/components/Buttons/Logo';
import createStyles from './styles';
import { appAbsoluteRoutes } from '@/Router';
import UserComponent from '@/components/User';
import CategoriesRadio from '@/components/Categories';
import NavLinks from '@/components/NavLinks';

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
  // const dimensions = useDimensions();
  const [showMenu, setShowMenu] = useAtom(menuAtom);
  const [showCart, setShowCart] = useAtom(cartAtom);
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = createStyles(theme);
  const user = useAtomValue(userAtom);
  const handleBackIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onBackIconClick) {
      onBackIconClick();
    } else {
      navigate(appAbsoluteRoutes.products, { replace: true });
    }
  };

  const handleInteractionItemClick = () => {
    setShowMenu(!showMenu);
  };

  let menuStyles = styles.main;
  if (showMenu) {
    menuStyles = { ...menuStyles, ...styles.menuVisible };
  }

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          display: 'flex',
          height: `${theme.dimensions.appBarHeight}px`,
          width: '100%',
          background: `linear-gradient(90deg, ${theme.palette.primary.dark},${theme.palette.primary.light})`,
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Link
                  variant="button"
                  component={NavLink}
                  to={appAbsoluteRoutes.products}
                  sx={styles.link}
                >
                  <Button sx={{ padding: '8px' }}>
                    <Typography color="secondary">Custom</Typography>
                  </Button>
                </Link>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogoButton />
          </Box>
          <Box sx={styles.sectionRight}>
            <Button
              onClick={() => setShowCart(!showCart)}
              sx={styles.iconButton}
            >
              <LocalMallTwoTone sx={styles.icon} />
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
            <Button
              sx={styles.iconButton}
              onClick={() => handleInteractionItemClick()}
            >
              {showMenu ? (
                <Close sx={{ ...styles.icon, ...styles.animation }} />
              ) : (
                <WidgetsTwoTone sx={{ ...styles.icon, ...styles.animation }} />
              )}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={menuStyles}>
        <Box sx={styles.menuWrapper}>
          <UserComponent />
          <Divider
            sx={{
              margin: '16px 0',
            }}
          />
          <CategoriesRadio />
          <Divider
            sx={{
              margin: '16px 0px',
            }}
          />
          <NavLinks />
          <Divider
            sx={{
              margin: '16px 0px',
            }}
          />
        </Box>
      </Box>
    </>
  );
}

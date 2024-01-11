import * as React from 'react';
import Menu from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Link,
  SxProps,
  Theme,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBackIos';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { menuAtom } from '@/recoil/atoms/menu';
import { userAtom } from '@/recoil/atoms';
import createStyles from './styles';
import { appAbsoluteRoutes } from '@/Router';
import FullLogoButton from '@/components/Buttons/FullLogo';

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
  const [, setShowMenu] = useRecoilState(menuAtom);
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = createStyles(theme);
  const user = useRecoilValue(userAtom);
  const handleBackIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onBackIconClick) {
      onBackIconClick();
    } else {
      navigate(appAbsoluteRoutes.products, { replace: true });
    }
  };

  const handleInteractionItemClick = () => {
    setShowMenu(true);
  };

  // let logoImgSrc = '/images/logo-circle-yellow.png';
  // if (dimensions.width >= 360) {
  //   logoImgSrc = '/images/logo-yellow.png';
  // }

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
        <Box>
          <FullLogoButton />
        </Box>
        <Box sx={styles.sectionRight}>
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

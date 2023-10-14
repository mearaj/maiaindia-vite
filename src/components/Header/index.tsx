import Menu from '@mui/icons-material/Menu';
import Diamond from '@mui/icons-material/Diamond';
import {
  AppBar,
  Box,
  Button,
  SxProps,
  Theme,
  Toolbar,
  useTheme,
} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBackIosNew';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { useAppDispatch } from '@/store';
import { useNavigate } from 'react-router-dom';
import { setShowMenu } from '@/store/features/ui';
import Drawer from '@/components/Drawer';
import useDimensions from '@/hooks/dimensions';
import logoDarkGreen from '@/assets/images/logo-dark-green.png';
import logoCircleDarkGreen from '@/assets/images/logo-circle-dark-green.png';
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
  const handleBackIconClick = () => {
    console.log(window.history.state);
    if (onBackIconClick) {
      onBackIconClick();
    } else if (
      window.history.state &&
      (window.history.state.idx > 0 || window.history.state.index > 0)
    ) {
      navigate(-1);
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
    <>
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
              <Button sx={styles.icon} onClick={handleBackIconClick}>
                <ArrowBack sx={styles.icon} />
              </Button>
            )}
            {!showBackIcon && (
              <Button sx={styles.icon}>
                <Box
                  src={logoImgSrc}
                  component="img"
                  sx={styles.icon}
                  alt="Logo"
                />
              </Button>
            )}
          </Box>
          <Box sx={styles.sectionRight}>
            <Button sx={styles.icon} onClick={() => navigate('/custom')}>
              <Diamond sx={styles.icon} />
            </Button>
            <Button sx={styles.icon} onClick={() => navigate('/cart')}>
              <ShoppingCart sx={styles.icon} />
            </Button>
            <Button
              sx={styles.icon}
              onClick={() => handleInteractionItemClick()}
            >
              <Menu sx={styles.icon} />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer />
    </>
  );
}

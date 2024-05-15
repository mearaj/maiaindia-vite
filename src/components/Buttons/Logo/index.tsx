import { Box, Button, Link, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { appAbsoluteRoutes } from '@/Router';
import logoImgSrc from '@/images/logo-circle-yellow.png';
import createStyles from './styles';

export interface LogoButtonProps {
  logoHeight?: number | string;
}

export default function LogoButton({ logoHeight = '42px' }: LogoButtonProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  return (
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
          sx={{ ...styles.icon, height: logoHeight }}
          alt="Logo"
        />
      </Button>
    </Link>
  );
}

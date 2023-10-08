import Menu from '@mui/icons-material/Menu';
import { Button, IconButton } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBackIosNew';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { useAppDispatch } from '@/store';
import { useNavigate } from 'react-router-dom';
import { setShowMenu } from '@/store/features/ui';
import useDimensions from '@/hooks/dimensions';
import logoDarkGreen from '@/assets/images/logo-dark-green.png';
import logoCircleDarkGreen from '@/assets/images/logo-circle-dark-green.png';
import styles from './index.module.css';

export interface HeaderProps {
  className?: string;
  showBackIcon?: boolean;
  onBackIconClick?: () => void;
}

export default function Header({
  className,
  showBackIcon = false,
  onBackIconClick,
}: HeaderProps) {
  const dimensions = useDimensions();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleBackIconClick = () => {
    if (onBackIconClick) {
      onBackIconClick();
    } else if (window.history.state && window.history.state.index > 0) {
      navigate(-1);
    } else {
      navigate('/home', { replace: true });
    }
  };

  const handleInteractionItemClick = () => {
    dispatch(setShowMenu(true));
  };

  let headerClassName = styles.header;
  if (className) {
    headerClassName = `${headerClassName} ${className}`;
  }

  let logoImgSrc = logoCircleDarkGreen;
  if (dimensions.width >= 360) {
    logoImgSrc = logoDarkGreen;
  }

  return (
    <header className={headerClassName}>
      <div className={styles.sectionLeft}>
        {showBackIcon && (
          <IconButton className={styles.button} onClick={handleBackIconClick}>
            <ArrowBack className={`${styles.arrowBackIcon} ${styles.icon}`} />
          </IconButton>
        )}
        {!showBackIcon && (
          <Button className={`${styles.button} ${styles.logoIconButton}`}>
            <img
              src={logoImgSrc}
              className={`${styles.logoIcon} ${styles.icon}`}
              alt="Logo"
            />
          </Button>
        )}
      </div>
      <div className={styles.sectionRight}>
        <div className={styles.drawerInteractionItems}>
          <Button className={styles.button} onClick={() => {}}>
            <ShoppingCart
              className={`${styles.shoppingCartIcon} ${styles.icon}`}
            />
          </Button>
          <Button
            className={styles.button}
            onClick={() => handleInteractionItemClick()}
          >
            <Menu className={`${styles.menuIcon} ${styles.icon}`} />
          </Button>
        </div>
      </div>
    </header>
  );
}

import {
  Accordion,
  AccordionSummary,
  IconButton,
  SwipeableDrawer,
  Typography,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { selectShowMenu, useAppDispatch, useAppSelector } from '@/store';
import { setShowMenu } from '@/store/features/ui';
import { SyntheticEvent } from 'react';
import Categories from '@/components/Categories';
import UserComponent from '@/components/User';
import logoDarkGreen from '@/assets/images/logo-dark-green.png';
import styles from './index.module.css';

export default function Drawer() {
  const dispatch = useAppDispatch();
  const showMenu = useAppSelector(selectShowMenu);

  return (
    <SwipeableDrawer
      sx={{ '& .MuiBackdrop-root': { display: 'none' } }}
      variant="temporary"
      onClose={(_: SyntheticEvent<NonNullable<unknown>, Event>) => {
        dispatch(setShowMenu(false));
      }}
      onOpen={(event: SyntheticEvent<NonNullable<unknown>, Event>) => {
        console.log(event);
      }}
      open={showMenu}
    >
      <header className={styles.navHeader}>
        <div className={styles.sectionLeft}>
          <div className={styles.logoContainer}>
            <img src={logoDarkGreen} alt="logo" className={styles.image} />
          </div>
        </div>
        <div className={styles.sectionRight}>
          <IconButton
            onClick={() => {
              dispatch(setShowMenu(false));
            }}
            className={styles.iconButton}
          >
            <Close className={styles.closeIcon} />
          </IconButton>
        </div>
      </header>
      <div className={styles.navBody}>
        <UserComponent />
        <Accordion
          expanded={false}
          onChange={(___) => null}
          onClick={() => {
            dispatch(setShowMenu(false));
            // router.replace('/admin');
          }}
          className={styles.accordion}
        >
          <AccordionSummary expandIcon={<ChevronRight />}>
            <Typography>Admin</Typography>
          </AccordionSummary>
        </Accordion>
        <Categories />
      </div>
    </SwipeableDrawer>
  );
}

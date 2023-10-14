import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  Card,
  IconButton,
  Typography,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { selectShowMenu, useAppDispatch, useAppSelector } from '@/store';
import { setShowMenu } from '@/store/features/ui';
import useDimensions from '@/hooks/dimensions';
import Categories from '@/components/Categories';
import UserComponent from '@/components/User';
import logoDarkGreen from '@/assets/images/logo-dark-green.png';
import styles from './index.module.css';

export interface DrawerProps {
  className?: string;
}

export default function RightDrawer(_: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const showMenu = useAppSelector(selectShowMenu);
  const minimumTransitionDuration = 250; // milliseconds
  const dimensions = useDimensions();
  const [touchStartPos, setTouchStartPos] = useState({
    clientX: 0,
    time: 0,
  });
  const [mousePressOrTouchStart, setMousePressOrTouchStart] = useState(false);

  const onTouchStartOrOnMouseDown = (
    e: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    setMousePressOrTouchStart(true);
    if (drawerRef && drawerRef.current) {
      drawerRef.current.style.transition = '';
      if (e.nativeEvent instanceof TouchEvent) {
        setTouchStartPos({
          clientX:
            drawerRef.current.offsetLeft - e.nativeEvent.touches[0].clientX,
          time: Date.now(),
        });
      } else if (e.nativeEvent instanceof MouseEvent) {
        setTouchStartPos({
          clientX: drawerRef.current.offsetLeft - e.nativeEvent.clientX,
          time: Date.now(),
        });
      }
    }
  };

  const onTouchMoveOrOnMouseMouse = (
    e: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    if (drawerRef && drawerRef.current && mousePressOrTouchStart) {
      let endX = 0;
      if (e.nativeEvent instanceof TouchEvent) {
        endX = e.nativeEvent.touches[0].clientX;
      } else if (e.nativeEvent instanceof MouseEvent) {
        endX = e.nativeEvent.clientX;
      }
      let totalDistance = touchStartPos.clientX + endX;
      if (totalDistance < 0) {
        totalDistance = 0;
      }
      drawerRef.current.style.right = `-${totalDistance}px`;
    }
  };

  const onTouchEndOrOnMouseUp = (
    __: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    if (drawerRef && drawerRef.current && mousePressOrTouchStart) {
      const timeDiff = Date.now() - touchStartPos.time;
      const distance = Math.abs(drawerRef.current.offsetLeft);
      const width = drawerRef.current.offsetWidth;
      // 50 accounts for horizontal scrollbar size
      if (timeDiff > 0 && distance > 40) {
        if (timeDiff < minimumTransitionDuration) {
          drawerRef.current.style.transition = `right ${timeDiff}ms`;
          dispatch(setShowMenu(false));
        } else {
          drawerRef.current.style.transition = `right ${minimumTransitionDuration}ms`;
          if (distance >= width / 2) {
            dispatch(setShowMenu(false));
          }
        }
      }
    }
    setTouchStartPos({ clientX: 0, time: 0 });
    setMousePressOrTouchStart(false);
  };

  const resetPosition = useCallback(() => {
    if (
      touchStartPos.clientX === 0 &&
      drawerRef &&
      drawerRef.current &&
      !mousePressOrTouchStart
    ) {
      drawerRef.current.style.transition = `right ${minimumTransitionDuration}ms`;
      if (showMenu) {
        drawerRef.current.style.right = '0px';
      } else {
        drawerRef.current.style.right = `-${drawerRef.current.offsetWidth}px`;
      }
    }
  }, [mousePressOrTouchStart, showMenu, touchStartPos.clientX]);

  useEffect(() => {
    resetPosition();
  }, [resetPosition, dimensions]);

  return (
    <Card
      ref={drawerRef}
      className={styles.nav}
      onTouchStart={onTouchStartOrOnMouseDown}
      onTouchMove={onTouchMoveOrOnMouseMouse}
      onTouchEnd={onTouchEndOrOnMouseUp}
      onMouseDown={onTouchStartOrOnMouseDown}
      onMouseMove={onTouchMoveOrOnMouseMouse}
      onMouseUp={onTouchEndOrOnMouseUp}
      role="presentation"
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
    </Card>
  );
}

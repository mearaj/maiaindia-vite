import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import Close from '@mui/icons-material/Close';
import logoDarkGreen from '@/assets/images/logo-dark-green.png';
import { useRecoilState } from 'recoil';
import { menuAtom } from '@/recoil/atoms/menu';
import useDimensions from '@/hooks/dimensions';
import UserComponent from '@/components/User';
import AdminComponent from '@/components/Admin';
import createStyles from './styles';
import Categories from '@/components/Categories';

export interface DrawerProps {
  className?: string;
}

export default function NavDrawer(_: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useRecoilState(menuAtom);
  const minTransDuration = 250; // milliseconds
  const dimensions = useDimensions();
  const [touchStartPos, setTouchStartPos] = useState({
    clientX: 0,
    time: 0,
  });
  const [mousePressOrTouchStart, setMousePressOrTouchStart] = useState(false);
  const theme = useTheme();
  const styles = createStyles(theme);

  const onTouchStartOrOnMouseDown = (
    e: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    setMousePressOrTouchStart(true);
    if (drawerRef && drawerRef.current) {
      drawerRef.current.style.transition = '';
      if (e.nativeEvent instanceof MouseEvent) {
        setTouchStartPos({
          clientX: drawerRef.current.offsetLeft - e.nativeEvent.clientX,
          time: Date.now(),
        });
      } else if (e.nativeEvent instanceof TouchEvent) {
        setTouchStartPos({
          clientX:
            drawerRef.current.offsetLeft - e.nativeEvent.touches[0].clientX,
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
      if (e.nativeEvent instanceof MouseEvent) {
        endX = e.nativeEvent.clientX;
      } else if (e.nativeEvent instanceof TouchEvent) {
        endX = e.nativeEvent.touches[0].clientX;
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
        if (timeDiff < minTransDuration) {
          drawerRef.current.style.transition = `right ${timeDiff}ms`;
          setShowMenu(false);
        } else {
          drawerRef.current.style.transition = `right ${minTransDuration}ms`;
          if (distance >= width / 2) {
            setShowMenu(false);
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
      drawerRef.current.style.transition = `right ${minTransDuration}ms`;
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
    <Box
      ref={drawerRef}
      sx={styles.root}
      onTouchStart={onTouchStartOrOnMouseDown}
      onTouchMove={onTouchMoveOrOnMouseMouse}
      onTouchEnd={onTouchEndOrOnMouseUp}
      onMouseDown={onTouchStartOrOnMouseDown}
      onMouseMove={onTouchMoveOrOnMouseMouse}
      onMouseUp={onTouchEndOrOnMouseUp}
      role="presentation"
    >
      <Box sx={styles.header}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box sx={{ height: '100%' }}>
            <Box
              component="img"
              src={logoDarkGreen}
              alt="logo"
              sx={{ height: '100%', width: 'auto' }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            flexShrink: '0',
          }}
        >
          <IconButton
            onClick={() => {
              setShowMenu(false);
            }}
          >
            <Close sx={{ fontSize: '32px' }} />
          </IconButton>
        </Box>
      </Box>
      <Box sx={styles.main}>
        <UserComponent />
        <AdminComponent />
        <Categories />
      </Box>
    </Box>
  );
}

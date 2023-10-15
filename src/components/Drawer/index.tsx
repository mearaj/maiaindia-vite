import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  Card,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { selectShowMenu, useAppDispatch, useAppSelector } from '@/store';
import { setShowMenu } from '@/store/features/ui';
import useDimensions from '@/hooks/dimensions';
import Categories from '@/components/Categories';
import UserComponent from '@/components/User';
import logoDarkGreen from '@/assets/images/logo-dark-green.png';

export interface DrawerProps {
  className?: string;
}

export default function Drawer(_: DrawerProps) {
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
  const theme = useTheme();

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
      sx={{
        position: 'fixed',
        top: '0',
        right: '-100vw',
        width: '100vw',
        height: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        borderRadius: '0',
        zIndex: theme.zIndex.appBar,
      }}
      onTouchStart={onTouchStartOrOnMouseDown}
      onTouchMove={onTouchMoveOrOnMouseMouse}
      onTouchEnd={onTouchEndOrOnMouseUp}
      onMouseDown={onTouchStartOrOnMouseDown}
      onMouseMove={onTouchMoveOrOnMouseMouse}
      onMouseUp={onTouchEndOrOnMouseUp}
      role="presentation"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: theme.dimensions.appBarHeight,
          padding: '16px',
          width: '100%',
        }}
      >
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
              dispatch(setShowMenu(false));
            }}
          >
            <Close sx={{ fontSize: '32px' }} />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          flexGrow: '1',
          flexShrink: '0',
          padding: '16px',
        }}
      >
        <UserComponent />
        <Accordion
          expanded={false}
          onChange={(___) => null}
          onClick={() => {
            dispatch(setShowMenu(false));
            // router.replace('/admin');
          }}
          sx={{
            backgroundColor: 'transparent',
            color: 'inherit',
          }}
        >
          <AccordionSummary expandIcon={<ChevronRight />}>
            <Typography>Admin</Typography>
          </AccordionSummary>
        </Accordion>
        <Categories />
      </Box>
    </Card>
  );
}

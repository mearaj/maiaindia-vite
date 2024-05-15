import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useAtom } from 'jotai';
import { cartAtom } from '@/jotai/atoms/cart';
import CartPage from '@/components/Cart';
import useDimensions from '@/hooks/useDimensions';
import createStyles from './styles';

export interface DrawerProps {
  className?: string;
}

export default function NavDrawer(_: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useAtom(cartAtom);
  const minTransDuration = 250; // milliseconds
  const dimensions = useDimensions();
  const [touchStartPos, setTouchStartPos] = useState({
    clientX: 0,
    clientY: 0,
    time: 0,
  });
  const [mousePressOrTouchStart, setMousePressOrTouchStart] = useState(false);
  const theme = useTheme();
  const styles = createStyles(theme);

  const resetPosition = useCallback(() => {
    if (
      // touchStartPos.clientX === 0 &&
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
  }, [mousePressOrTouchStart, showMenu]);
  const onTouchStartOrOnMouseDown = (
    e: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    if (drawerRef && drawerRef.current) {
      e.stopPropagation();
      const { current } = drawerRef;
      setMousePressOrTouchStart(true);
      current.style.transition = '';
      if (e.nativeEvent instanceof MouseEvent) {
        setTouchStartPos({
          clientX: current.offsetLeft - e.nativeEvent.clientX,
          clientY: current.offsetTop - e.nativeEvent.clientY,
          time: Date.now(),
        });
      } else if (e.nativeEvent instanceof TouchEvent) {
        setTouchStartPos({
          clientX: current.offsetLeft - e.nativeEvent.touches[0].clientX,
          clientY: current.offsetTop - e.nativeEvent.touches[0].clientY,
          time: Date.now(),
        });
      }
    }
  };

  const onTouchMoveOrOnMouseMouse = (
    e: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    if (drawerRef && drawerRef.current && mousePressOrTouchStart) {
      e.stopPropagation();
      let endX = 0;
      let endY = 0;
      if (e.nativeEvent instanceof MouseEvent) {
        endX = e.nativeEvent.clientX;
        endY = e.nativeEvent.clientY;
      } else if (e.nativeEvent instanceof TouchEvent) {
        endX = e.nativeEvent.touches[0].clientX;
        endY = e.nativeEvent.touches[0].clientY;
      }
      const totalYDistance = touchStartPos.clientY + endY;
      if (totalYDistance > 30 || totalYDistance < -30) {
        return;
      }
      let totalDistance = touchStartPos.clientX + endX;
      if (totalDistance < 0) {
        totalDistance = 0;
      }
      drawerRef.current.style.right = `-${totalDistance}px`;
    }
  };

  const onTouchEndOrOnMouseUp = (
    e: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    if (drawerRef && drawerRef.current && mousePressOrTouchStart) {
      e.stopPropagation();
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
    setTouchStartPos({ clientX: 0, time: 0, clientY: 0 });
    setMousePressOrTouchStart(false);
  };

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
      <CartPage />
    </Box>
  );
}

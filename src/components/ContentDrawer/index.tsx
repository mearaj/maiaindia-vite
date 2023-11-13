import * as React from 'react';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Card } from '@mui/material';
import { Product } from '@/firebase/product';
import useDimensions from '@/hooks/useDimensions';

export interface ContentDrawerProps extends PropsWithChildren {
  product: Product;
  activeProductID: string;
  setActiveProductID: Dispatch<SetStateAction<string>>;
}

export default function ContentDrawer({
  children,
  product,
  activeProductID = '',
  setActiveProductID,
}: ContentDrawerProps) {
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions();
  const minimumTransitionDuration = 250; // milliseconds
  const [touchStart, setTouchStart] = useState({
    clientX: 0,
    time: 0,
  });
  const [mousePressOrTouchStart, setMousePressOrTouchStart] = useState(false);

  const onTouchStartOrOnMouseDown = (
    e: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    setMousePressOrTouchStart(true);
    if (sidebarContainerRef && sidebarContainerRef.current) {
      sidebarContainerRef.current.style.transition = '';
      if (e.nativeEvent instanceof MouseEvent) {
        setTouchStart({
          clientX:
            sidebarContainerRef.current.offsetLeft - e.nativeEvent.clientX,
          time: Date.now(),
        });
      } else if (e.nativeEvent instanceof TouchEvent) {
        setTouchStart({
          clientX:
            sidebarContainerRef.current.offsetLeft -
            e.nativeEvent.touches[0].clientX,
          time: Date.now(),
        });
      }
    }
  };

  const onTouchMoveOrOnMouseMouse = (
    e: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    if (
      sidebarContainerRef &&
      sidebarContainerRef.current &&
      mousePressOrTouchStart
    ) {
      let endX = 0;
      if (e.nativeEvent instanceof MouseEvent) {
        endX = e.nativeEvent.clientX;
      } else if (e.nativeEvent instanceof TouchEvent) {
        endX = e.nativeEvent.touches[0].clientX;
      }
      let totalDistance = touchStart.clientX + endX;
      if (totalDistance > 0) {
        totalDistance = 0;
      }
      sidebarContainerRef.current.style.left = `${totalDistance}px`;
    }
  };

  const onTouchEndOrOnMouseUp = (
    _: React.TouchEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    if (
      sidebarContainerRef &&
      sidebarContainerRef.current &&
      mousePressOrTouchStart
    ) {
      const timeDiff = Date.now() - touchStart.time;
      const distance = Math.abs(sidebarContainerRef.current.offsetLeft);
      const width = sidebarContainerRef.current.offsetWidth;
      if (timeDiff > 0 && distance > 0 && activeProductID === product.id) {
        if (timeDiff < minimumTransitionDuration) {
          sidebarContainerRef.current.style.transition = `left ${timeDiff}ms`;
          setActiveProductID('');
        } else {
          sidebarContainerRef.current.style.transition = `left ${minimumTransitionDuration}ms`;
          if (distance >= width / 2) {
            setActiveProductID('');
          }
        }
      }
    }
    setTouchStart({ clientX: 0, time: 0 });
    setMousePressOrTouchStart(false);
  };

  useEffect(() => {
    if (
      touchStart.clientX === 0 &&
      sidebarContainerRef &&
      sidebarContainerRef.current &&
      !mousePressOrTouchStart
    ) {
      if (!sidebarContainerRef.current.style.transition) {
        sidebarContainerRef.current.style.transition = `left ${minimumTransitionDuration}ms`;
      }
      if (activeProductID === product.id) {
        sidebarContainerRef.current.style.left = '0px';
      } else {
        sidebarContainerRef.current.style.left = `-${sidebarContainerRef.current.offsetWidth}px`;
      }
    }
  }, [
    mousePressOrTouchStart,
    activeProductID,
    touchStart.clientX,
    dimensions,
    product.id,
  ]);

  return (
    <Card
      ref={sidebarContainerRef}
      sx={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        left: '-100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        borderRadius: 0,
        padding: '16px 0',
      }}
      onTouchStart={onTouchStartOrOnMouseDown}
      onTouchMove={onTouchMoveOrOnMouseMouse}
      onTouchEnd={onTouchEndOrOnMouseUp}
      onMouseDown={onTouchStartOrOnMouseDown}
      onMouseMove={onTouchMoveOrOnMouseMouse}
      onMouseUp={onTouchEndOrOnMouseUp}
      onClick={() => setActiveProductID('')}
      role="presentation"
    >
      {children}
    </Card>
  );
}

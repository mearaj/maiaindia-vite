import { useEffect, useState } from 'react';

export interface Dimensions {
  height: number;
  width: number;
}

export default function useDimensions() {
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });

  const onWindowResize = (_: UIEvent) => {
    if (window) {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
  };

  useEffect(() => {
    window?.addEventListener('resize', onWindowResize);
    return () => window?.removeEventListener('resize', onWindowResize);
  }, []);
  useEffect(() => {
    if (
      window &&
      (window.innerHeight !== dimensions.height ||
        window.innerWidth !== dimensions.width)
    ) {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
  }, [dimensions]);

  return dimensions;
}

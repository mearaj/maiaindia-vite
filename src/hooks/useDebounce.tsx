import { useEffect, useMemo, useRef } from 'react';
import { debounce } from '@mui/material';

export const useAppDebounce = (callback: Function, delay: number) => {
  const ref = useRef<Function>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, delay);
  }, [delay]);

  return debouncedCallback;
};

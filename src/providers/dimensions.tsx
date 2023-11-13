import { createContext, PropsWithChildren } from 'react';
import useDimensions, { UseDimensions } from '@/hooks/useDimensions';

export const DimensionsContext = createContext<UseDimensions>({
  height: 0,
  width: 0,
});

export default function DimensionsProvider({ children }: PropsWithChildren) {
  const dimensions = useDimensions();
  return (
    <DimensionsContext.Provider value={dimensions}>
      {children}
    </DimensionsContext.Provider>
  );
}

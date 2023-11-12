import { createContext, PropsWithChildren } from 'react';
import useDimensions, { Dimensions } from '@/hooks/dimensions';

export const DimensionsContext = createContext<Dimensions>({
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

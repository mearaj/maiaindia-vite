import { PropsWithChildren } from 'react';
import DimensionsProvider from '@/providers/dimensions';
import AppThemeProvider from '@/providers/theme';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <DimensionsProvider>
      <AppThemeProvider>{children}</AppThemeProvider>
    </DimensionsProvider>
  );
}

import { PropsWithChildren } from 'react';
import FirebaseProvider from '@/providers/firebase';
import StoreProvider from '@/providers/store';
import DimensionsProvider from '@/providers/dimensions';
import AppThemeProvider from '@/providers/theme';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <StoreProvider>
      <FirebaseProvider>
        <DimensionsProvider>
          <AppThemeProvider>{children}</AppThemeProvider>
        </DimensionsProvider>
      </FirebaseProvider>
    </StoreProvider>
  );
}

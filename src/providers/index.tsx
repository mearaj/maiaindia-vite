import { PropsWithChildren } from 'react';
import FirebaseProvider from '@/providers/firebase';
import DimensionsProvider from '@/providers/dimensions';
import AppThemeProvider from '@/providers/theme';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <FirebaseProvider>
      <DimensionsProvider>
        <AppThemeProvider>{children}</AppThemeProvider>
      </DimensionsProvider>
    </FirebaseProvider>
  );
}

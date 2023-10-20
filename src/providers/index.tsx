import { PropsWithChildren } from 'react';
import FirebaseProvider from '@/providers/firebase';
import StoreProvider from '@/providers/store';
import DimensionsProvider from '@/providers/dimensions';
import AppThemeProvider from '@/providers/theme';
import CategoriesProvider from '@/providers/categories';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <StoreProvider>
      <FirebaseProvider>
        <DimensionsProvider>
          <AppThemeProvider>
            <CategoriesProvider>{children}</CategoriesProvider>
          </AppThemeProvider>
        </DimensionsProvider>
      </FirebaseProvider>
    </StoreProvider>
  );
}

import { PropsWithChildren } from 'react';
import FirebaseProvider from '@/providers/firebase';
import StoreProvider from '@/providers/store';
import DimensionsProvider from '@/providers/dimensions';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <StoreProvider>
      <FirebaseProvider>
        <DimensionsProvider>{children}</DimensionsProvider>
      </FirebaseProvider>
    </StoreProvider>
  );
}

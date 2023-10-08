import { PropsWithChildren } from 'react';
import FirebaseProvider from '@/providers/firebase';
import StoreProvider from '@/providers/store';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <StoreProvider>
      <FirebaseProvider>{children}</FirebaseProvider>
    </StoreProvider>
  );
}

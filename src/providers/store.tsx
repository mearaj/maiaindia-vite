import { store } from '@/store';
import { Provider } from 'react-redux';
import { PropsWithChildren } from 'react';

export default function StoreProvider({ children }: PropsWithChildren) {
  return <Provider store={store}>{children}</Provider>;
}

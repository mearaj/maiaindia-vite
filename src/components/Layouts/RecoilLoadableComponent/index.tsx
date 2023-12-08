import { Loadable } from 'recoil';
import { Box } from '@mui/material';
import { Loader } from '@/components';
import { PropsWithChildren } from 'react';

export interface RecoilLoadableComponentProps<T> extends PropsWithChildren {
  recoilLoadable: Loadable<T>;
}

export default function RecoilLoadableComponent<T>({
  recoilLoadable,
  children,
}: RecoilLoadableComponentProps<T>) {
  const { contents, state } = recoilLoadable;
  if (state === 'loading') {
    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Loader />
      </Box>
    );
  }
  if (state === 'hasError') {
    const message = contents.message
      ? contents.message
      : 'An unknown error occurred!';
    return (
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {message}
      </Box>
    );
  }
  return children;
}

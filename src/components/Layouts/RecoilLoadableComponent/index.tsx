import { Loadable } from 'recoil';
import { Box, SxProps, Theme } from '@mui/material';
import { Loader } from '@/components';
import { PropsWithChildren } from 'react';

export interface RecoilLoadableComponentProps<T> extends PropsWithChildren {
  recoilLoadable: Loadable<T>;
  loaderContainerStyle?: SxProps<Theme>;
  errorContainerStyle?: SxProps<Theme>;
  showLoader?: boolean;
  showError?: boolean;
}

export default function RecoilLoadableComponent<T>({
  recoilLoadable,
  children,
  loaderContainerStyle = {},
  errorContainerStyle = {},
  showError = true,
  showLoader = true,
}: RecoilLoadableComponentProps<T>) {
  const { contents, state } = recoilLoadable;
  if (state === 'loading') {
    if (!showLoader) {
      return null;
    }
    const containerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...loaderContainerStyle,
    };
    return (
      <Box sx={containerStyle}>
        <Loader />
      </Box>
    );
  }
  if (state === 'hasError') {
    if (!showError) {
      return true;
    }
    const containerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...errorContainerStyle,
    };
    const message = contents.message
      ? contents.message
      : 'An unknown error occurred!';
    return <Box sx={containerStyle}>{message}</Box>;
  }
  return children;
}

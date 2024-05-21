import { Box, SxProps, Theme } from '@mui/material';
import { Loader } from '@/components';
import { PropsWithChildren } from 'react';
import { Loadable } from 'jotai/vanilla/utils/loadable';

export interface LoadableComponentProps<T> extends PropsWithChildren {
  jotaiLoadable: Loadable<T>;
  loaderContainerStyle?: SxProps<Theme>;
  errorContainerStyle?: SxProps<Theme>;
  showLoader?: boolean;
  showError?: boolean;
  loaderText?: string | null;
}

export default function LoadableComponent<T>({
  jotaiLoadable,
  children,
  loaderContainerStyle = {},
  errorContainerStyle = {},
  showError = true,
  showLoader = true,
  loaderText = 'Loading...',
}: LoadableComponentProps<T>) {
  if (jotaiLoadable.state === 'loading') {
    if (!showLoader) {
      return null;
    }
    const containerStyle: SxProps<Theme> = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      ...loaderContainerStyle,
    };
    return (
      <Box sx={containerStyle}>
        {loaderText && <Box>{loaderText}</Box>}
        <Loader />
      </Box>
    );
  }
  if (jotaiLoadable.state === 'hasError') {
    if (!showError) {
      return true;
    }
    const containerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...errorContainerStyle,
    };
    const message = jotaiLoadable.error
      ? jotaiLoadable.error.toString()
      : 'An unknown error occurred!';
    return <Box sx={containerStyle}>{message}</Box>;
  }
  return children;
}

import { Box, Button, ButtonProps, useTheme } from '@mui/material';
import React from 'react';
import { userAtom } from '@/recoil/atoms';
import { useRecoilValue } from 'recoil';
import { AuthState } from '@/recoil/atoms/user';
import Loader from '@/components/Loader';
import GoogleIcon from '@/icons/google-g';
import createStyles from '@/components/Buttons/SignIn/styles';
import useSignInWithGooglePopup from '@/hooks/useSignInWithGooglePopup';

export const useSignInWithGooglePopUp = () => {};
export default function SignInButton({
  children: _children,
  sx,
  ...otherProps
}: ButtonProps) {
  const { authState, userState } = useRecoilValue(userAtom);
  const theme = useTheme();
  const styles = createStyles(theme);
  const { signInWithGooglePopUp } = useSignInWithGooglePopup();

  const signIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    await signInWithGooglePopUp();
  };

  if (userState) {
    return null;
  }

  const iconContainerStyle = styles.iconContainer;
  const buttonStyle = { ...styles.button, ...sx };

  return (
    <Button
      sx={{ ...buttonStyle }}
      onClick={signIn}
      {...otherProps}
      disabled={authState !== AuthState.idle}
    >
      <Box sx={iconContainerStyle}>
        <GoogleIcon style={{ fontSize: '24px' }} />
      </Box>
      {authState !== AuthState.idle ? (
        <Loader loaderParentSx={{ padding: 0 }} />
      ) : (
        <Box sx={{ fontWeight: 'bold', textAlign: 'left', lineHeight: 1 }}>
          Sign In
        </Box>
      )}
    </Button>
  );
}

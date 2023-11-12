import { Box, Button, ButtonProps, useTheme } from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { signInWithGooglePopUp } from '@/firebase/signIn';
import { authLoadingAtom } from '@/recoil/atoms/authLoading';
import Loader from '@/components/Loader';
import GoogleIcon from '@/icons/google-g';
import createStyles from '@/components/Buttons/SignIn/styles';

export default function SignInButton({
  children: _children,
  sx,
  ...otherProps
}: ButtonProps) {
  const user = useRecoilValue(userAtom);
  const theme = useTheme();
  const styles = createStyles(theme);
  const [isAuthLoading, setIsAuthLoading] = useRecoilState(authLoadingAtom);

  const iconContainerStyle = styles.iconContainer;
  const buttonStyle = { ...styles.button, ...sx };

  const signIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAuthLoading(true);
    await signInWithGooglePopUp();
  };

  if (user) {
    return null;
  }

  return (
    <Button sx={{ ...buttonStyle }} onClick={signIn} {...otherProps}>
      <Box sx={iconContainerStyle}>
        <GoogleIcon style={{ fontSize: '24px' }} />
      </Box>
      {isAuthLoading ? (
        <Loader loaderParentSx={{ padding: 0 }} />
      ) : (
        <Box sx={{ fontWeight: 'bold', textAlign: 'left', lineHeight: 1 }}>
          Sign In
        </Box>
      )}
    </Button>
  );
}

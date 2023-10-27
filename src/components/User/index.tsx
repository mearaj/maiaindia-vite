import { Box, Button } from '@mui/material';
import { useContext, useState } from 'react';
import imagePlaceholder from '@/assets/images/placeholder.svg';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { signInWithGooglePopUp } from '@/firebase/signIn';
import { signOut } from '@/firebase/signOut';
import Loader from '@/components/Loader';
import { FirebaseContext } from '@/providers/firebase';
import GoogleIcon from '@/icons/google-g';

export default function UserComponent() {
  const { isLoadingAuth } = useContext(FirebaseContext);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const user = useRecoilValue(userAtom);
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '8px 16px',
    width: 'calc(320px - 48px)',
    margin: '8px 0',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '18px',
  };
  const iconContainerStyle = {
    width: '32px',
    height: '32px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
  };

  const signIn = async () => {
    setSigningIn(true);
    await signInWithGooglePopUp();
    setSigningIn(false);
  };

  const signOutUser = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  if (isLoadingAuth) {
    return <Loader />;
  }

  if (user) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '32px',
        }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src={user.photoURL ?? imagePlaceholder}
              alt="user"
              sx={{ width: '60px', borderRadius: '50%', marginRight: '16px' }}
            />
          </Box>
          <Box>
            <Box>{user.displayName}</Box>
            <Button
              sx={{
                ...buttonStyle,
                fontWeight: 'bold',
                textAlign: 'start',
                padding: '0',
                margin: '0px',
                lineHeight: '1.2',
              }}
              onClick={signOutUser}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <Loader loaderParentSx={{ padding: 0 }} />
              ) : (
                'Sign Out'
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexShrink: '1',
        flexGrow: '0',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button sx={buttonStyle} onClick={signIn}>
        <Box sx={iconContainerStyle}>
          <GoogleIcon style={{ fontSize: '24px' }} />
        </Box>
        {signingIn ? (
          <Loader loaderParentSx={{ padding: 0 }} />
        ) : (
          <Box sx={{ fontWeight: 'bold', textAlign: 'left' }}>
            Google Sign In
          </Box>
        )}
      </Button>
    </Box>
  );
}

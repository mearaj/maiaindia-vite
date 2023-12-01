import { Button } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { AuthState } from '@/recoil/atoms/user';
import { appFirebaseAuth } from '@/firebase';
import { signOut } from '@firebase/auth';
import Loader from '@/components/Loader';

export default function SignOutButton() {
  const [{ authState, userState }, setAuthState] = useRecoilState(userAtom);
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

  const signOutUser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setAuthState({ authState: AuthState.signingOut, userState });
    await signOut(appFirebaseAuth);
  };

  if (!userState) {
    return null;
  }

  return (
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
      disabled={authState !== AuthState.idle}
    >
      {authState !== AuthState.idle ? (
        <Loader loaderParentSx={{ padding: 0 }} />
      ) : (
        'Sign Out'
      )}
    </Button>
  );
}

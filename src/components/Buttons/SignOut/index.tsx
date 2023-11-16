import { Button } from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { signOut } from '@/firebase/signOut';
import { AuthState, authStateAtom } from '@/recoil/atoms/authState';
import Loader from '@/components/Loader';

export default function SignOutButton() {
  const user = useRecoilValue(userAtom);
  const [authState, setAuthState] = useRecoilState(authStateAtom);
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
    setAuthState(AuthState.signingOut);
    await signOut();
  };

  if (!user) {
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
